require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json()); 


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));



const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});


UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const JobSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: String, required: true },
    role: { type: String, required: true },
    status: {
        type: String,
        enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
        default: 'Applied',
    },
    applicationDate: { type: Date, default: Date.now },
    statusHistory: [{ 
        status: String,
        date: { type: Date, default: Date.now },
    }],
    resumePath: { type: String, required: false }, 
});


JobSchema.pre('save', function(next) {
    if (this.isNew || this.isModified('status')) {
        
        const lastStatus = this.statusHistory.length > 0 ? this.statusHistory[this.statusHistory.length - 1].status : null;
        if (this.isNew || lastStatus !== this.status) {
            this.statusHistory.push({ status: this.status, date: new Date() });
        }
    }
    next();
});


const User = mongoose.model('User', UserSchema);
const Job = mongoose.model('Job', JobSchema);


const auth = (req, res, next) => {
    
    const token = req.header('x-auth-token');

    
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; 
        next();
    } catch (e) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


app.use('/uploads', express.static('uploads'));




app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({ username, password });
        await user.save();

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});




app.post('/api/jobs', auth, async (req, res) => {
    try {
        const { company, role, status } = req.body;
        const newJob = new Job({
            user: req.user.id,
            company,
            role,
            status: status || 'Applied', 
        });
        const job = await newJob.save();
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.get('/api/jobs', auth, async (req, res) => {
    try {
        const { status } = req.query;
        let query = { user: req.user.id };
        if (status) {
            query.status = status;
        }
        const jobs = await Job.find(query).sort({ applicationDate: -1 }); 
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.put('/api/jobs/:id', auth, async (req, res) => {
    try {
        const { company, role, status } = req.body;
        const job = await Job.findById(req.params.id);

        if (!job) return res.status(404).json({ msg: 'Job not found' });
        
        if (job.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        
        job.company = company !== undefined ? company : job.company;
        job.role = role !== undefined ? role : job.role;

        
        if (status !== undefined && job.status !== status) {
            job.status = status;
            
        }

        await job.save(); 
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.delete('/api/jobs/:id', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) return res.status(404).json({ msg: 'Job not found' });
        
        if (job.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Job.deleteOne({ _id: req.params.id }); 
        res.json({ msg: 'Job removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.post('/api/jobs/upload-resume/:id', auth, upload.single('resume'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded' });
        }

        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ msg: 'Job not found' });
        if (job.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        job.resumePath = req.file.path; 
        await job.save();
        res.json({ msg: 'Resume uploaded successfully', filePath: req.file.path });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));