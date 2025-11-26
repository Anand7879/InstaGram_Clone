let express = require('express')
let bcrypt=    require('bcrypt')
let jwt=    require('jsonwebtoken')
let mongoose = require('mongoose');
const crypto = require('crypto');
let {sendEmail} = require('./sendEmail')
let cors = require('cors')
let app  = express()
app.use(cors())
app.use(express.json())
let Upload = require('./Upload')
let User=    require('./UserSchema')
const auth = require("./Auth");
mongoose.connect('mongodb://127.0.0.1:27017/insta').then(()=>{
    console.log("DB Connected...");
    
})

// app.get('/',(req,res)=>{
//     res.send("Hello From Anand...")
// })


// Create account
app.post('/create', async (req, res) => {
  try {
    let { userName, email, passWord ,FullName , role} = req.body
    console.log(userName, email, "Creating user...");

    // Check if user already exists
    let user = await User.findOne({ email })
    console.log(user, "Existing user check");

    if (user) {
      return res.status(400).json({ 
        success: false, 
        message: "User already exists" 
      })
    }

    // Hash password
    let updatedP = await bcrypt.hash(passWord, 10)
    console.log("Password hashed");

    // Create new user
    let userData = new User({
      userName,
      email,
      passWord: updatedP,
      FullName,
      role:role||'user'
    })

    await userData.save()
    
    return res.status(201).json({ 
      success: true, 
      message: "Account created successfully" 
    })

  } catch (error) {
    console.error("Error in /create:", error)
    return res.status(500).json({ 
      success: false, 
      message: "Server error. Please try again." 
    })
  }
})


// Login
app.post("/login", async (req, res) => {
  try {
    let { email, passWord } = req.body

    // Check if user exists
    let userInfo = await User.findOne({ email })
    console.log(userInfo, "User found");

    if (!userInfo) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      })
    }

    // Verify password
    let validPass = await bcrypt.compare(passWord, userInfo.passWord)
    
    if (validPass) {
        let token = jwt.sign({_id: userInfo._id, email: userInfo.email, role: userInfo.role }, "JHBFIUWBFIUWB");
        console.log(token,"tokennnnn");
      return res.status(200).json({ 
        success: true, 
        message: "Login successful",
        token: token,
        user: {
          userName: userInfo.userName,
          _id: userInfo._id,
          email: userInfo.email,
          role: userInfo.role
        }
      })
    } else {
      return res.status(401).json({ 
        success: false, 
        message: "Sorry, your password was incorrect. Please double-check your password." 
      })
    }

  } catch (error) {
    console.error("Error in /login:", error)
    return res.status(500).json({ 
      success: false, 
      message: "Server error. Please try again." 
    })
  }
})


app.post('/forgot-password',async(req,res)=>{
    const {email} = req.body;
    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).send('User Not Found');
        }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 3600000; 
    await user.save();


    // const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    resetUrl = `http://localhost:5173/reset/${resetToken}`;
    await sendEmail(
      user.email,
      'Password Reset Request',
      `Click the link below to reset your password:\n\n${resetUrl}`
    );
     res.status(200).send('Password reset email sent');

    } catch (error) {
    res.status(500).send('Error sending password reset email: ' + error.message);
    }
})


// Reset Password
app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }, 
    });

    if (!user) {
      return res.status(400).send('Invalid or expired token');
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.passWord = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.status(200).send('Password reset successfully');
  } catch (error) {
    res.status(500).send('Error resetting password: ' + error.message);
  }
});



app.post('/upload',auth,async (req,res) => {
  try{

    const userId = req.user._id;  
    let {imgUrl} = req.body

     if (!imgUrl) {
      return res.status(400).json({ msg: "Missing data" });
    }
    
    let uploaD = new Upload({
        imgUrl,
        user: userId,      
        likedBy: []
    })
    
    await uploaD.save()
    return res.send("URL Uploaded Successfully")
  } catch (err) {
    console.error("Error during upload:", err.message);
   return res.status(500).json({ msg: "Error during upload", error: err.message });
  }
  })


app.post("/like/:id", auth, async (req, res) =>{
  try {
    const postId = req.params.id;
    const userId = req.user?._id;
    const post = await Upload.findById(postId);

    if(!post){
      return res.status(404).json({ success: false, message: "Post not found"});
    }
    post.likedBy = post.likedBy.filter(id => id != null)

      let alreadyLiked = await Upload.likedBy.includes(userId)

      if (alreadyLiked) {
      Upload.likedBy = Upload.likedBy.filter(
        id => id && id.toString() !== userId.toString()
      );

      Upload.likeCount = Math.max(0,Upload.likeCount - 1);
      await Upload.save();

      return res.json({
        success: true,
        message: "Like removed",
        likeCount: Upload.likeCount
      });

    }

     // 🟢 IF NOT LIKED → LIKE
    post.likedBy.push(userId);
    post.likeCount += 1;

   await post.save();
    return res.json({
      success: true,
      message: "Liked",
      likeCount: post.likeCount
    });

  } catch (err) {
    console.log("LIKE API ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.listen(3000,()=>{
    console.log("Server running on port 3000");
    
})