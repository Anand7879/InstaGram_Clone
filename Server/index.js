let express = require('express')
let bcrypt=    require('bcryptjs')
let jwt=    require('jsonwebtoken')
let mongoose = require('mongoose');
const crypto = require('crypto');
let {sendEmail} = require('./sendEmail')
let cors = require('cors')
let app  = express()
app.use(cors())
app.use(express.json())
let Upload = require('./Upload')
let User=    require('./User')
const auth = require("./Auth");
let Comment = require('./Comment');
const { log } = require('console');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("DB Connected...");
    
})
let Story = require('./story');

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

     console.log("Plain Password:", passWord);
     console.log("Hashed from DB:", userInfo.passWord);
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
    const { userName, imgUrl, user } = req.body;

     if (!userName || !imgUrl || !user) {
      return res.status(400).json({ msg: "Missing data" });
    }
    
    let uploaD = new Upload({
        userName,
        imgUrl,
        user,      
        likedBy: []
    })
    
    await uploaD.save()
    console.log(imgUrl, "url saved");
    return res.send("URL Uploaded Successfully")

  } catch (err) {
    console.error("Error during upload:", err.message);
   return res.status(500).json({ msg: "Error during upload", error: err.message });
  }
  })

app.get("/posts", auth, async (req, res) => {
  try {
    const userId = req.user._id.toString(); // logged-in user ID

    let posts = await Upload.find()
      .populate("user", "userName")
      .sort({ createdAt: -1 })
      .lean(); // returns plain JS objects

    const postsWithDetails = await Promise.all(
      posts.map(async (post) => {
        // fetch all comments
        const comments = await Comment.find({ postId: post._id })
          .sort({ createdAt: 1 })
          .lean();

        // FIX: convert likedBy elements to strings
        const likedBy = (post.likedBy || []).map(id => id?.toString());

        // FIX: check if current user liked the post
        const isLiked = likedBy.includes(userId);

        return {
          ...post,
          comments,
          isLiked  // ⭐⭐ THIS FIXES YOUR HEART ICON
        };
      })
    );

    res.json(postsWithDetails);

  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ msg: "Error fetching posts" });
  }
});


app.post("/like/:id", auth, async (req, res) =>{
  try {
    const postId = req.params.id;
    const userId = req.user?._id;

     if (!userId) {
      return res.status(400).json({ success: false, message: "User not authenticated" });
    }

     // Find post
    const post = await Upload.findById(postId);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Clean NULL values from likedBy (runtime cleanup)
    post.likedBy = post.likedBy.filter(id => id !== null);

      let alreadyLiked = await post.likedBy.includes(userId)

      if (alreadyLiked) {
      post.likedBy = post.likedBy.filter(
        id => id && id.toString() !== userId.toString()
      );

      post.likeCount = Math.max(0,post.likeCount - 1);
      await post.save();

      return res.json({
        success: true,
        message: "Like removed",
        likeCount: post.likeCount
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

app.post("/follow/:id",auth,async(req,res)=>{
  let targetUserId = req.params.id;
  let currentUserId = req.user._id;

   console.log(req.user,"hehh");
  if(targetUserId==currentUserId){
   return res.json({msg:"nashe mat karo...."})

  }

  let targetUser = await User.findById(targetUserId)
  let currentUser = await User.findById(currentUserId)

  // Unfollow
  if(!currentUser || !targetUser){
    res.send("User not found")
  }
  
  let alreadyFollow = currentUser.following.includes(targetUserId)
  if(alreadyFollow){
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== targetUserId.toString()
    )

    targetUser.followers = targetUser.followers.filter(
      id => id.toString() !== currentUserId.toString()
    )
    await currentUser.save()
    await targetUser.save()

   return res.json({
      success: true,
      msg: "Unfollowed successfully"
    });
  }


   // Follow
   currentUser.following.push(targetUserId)
   targetUser.followers.push(currentUserId)

   await currentUser.save()
   await targetUser.save()
   
   res.json({msg:"followed succe......"})

})

app.post("/comment/:id", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: "Comment text is required" 
      });
    }

    // Verify post exists
    const post = await Upload.findById(postId);
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: "Post not found" 
      });
    }

    // Get user info
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Create new comment
    const newComment = new Comment({
      postId,
      userId,
      userName: user.userName,
      text: text.trim()
    });

    await newComment.save();

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment
    });

  } catch (err) {
    console.error("COMMENT API ERROR:", err);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
});


app.delete("/comment/:id",auth,async(req,res) => {

  try{
    const commentId = req.params.id;
    const userId = req.user._id;
    
    const comment = await Comment.findById(commentId);
    
    if (!comment) {
      return res.status(404).json({ 
        success: false, 
        message: "Comment not found" 
      });
    }
    
    if(comment.userId.toString() !== userId.toString()){
      return res.status(404).json({ 
        success: false, 
        message: "you can only delete your own comments" 
      })

    }
     await Comment.findByIdAndDelete(commentId)

    return res.json({ 
        success: true, 
        message: "Comment Deleted Successfully" 
      });
 }catch{
    console.error("DELETE COMMENT ERROR:");
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
})

app.post("/search", async(req,res) =>{
  let query = req.query.q
  if(!query){
    return res.send("query not found")
  }

  let isMatch = await User.find(
  {
    $or: [
      { userName: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } }
    ]
  },
  { passWord: 0 }   // ← hide password
).limit(2);

res.send({ msg: isMatch });
console.log(isMatch)
  
})

app.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-passWord");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);

  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/user-posts/:id", auth, async (req, res) => {
  try {
    const posts = await Upload.find({ user: req.params.id })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/search", auth, async (req, res) => {
  try {
    const query = req.query.q;
    const currentUserId = req.user._id;

    if (!query) return res.json([]);

    const users = await User.find({
      userName: { $regex: query, $options: "i" },
      _id: { $ne: currentUserId } // exclude self
    })
      .limit(7)
      .select("userName followers");

    const formatted = users.map(u => ({
      _id: u._id,
      userName: u.userName,
      isFollowing: u.followers.includes(currentUserId),
      followersCount: u.followers.length
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ msg: "Search error" });
  }
});

app.post("/story",auth, async(req,res)=>{
  const {mediaUrl }= req.body;
  if(!mediaUrl){
    return res.status(400).json({msg:"Media required"});
  }
   const story = new Story({
    mediaUrl,
    user: req.user._id,
    expiresAt: new Date(Date.now() + 24*60*60*1000) // 24 hours from now
   });

   await story.save();

   return res.status(201).json({
    success: true,
    message: "Story created successfully",
    story
   });
});

app.get("/stories", auth, async (req, res) => {
  try {
    const me = await User.findById(req.user._id);

    if (!me) return res.json([]);

    const allowedUsers = [
      req.user._id,
      ...me.following,
      ...me.followers
    ];

    const stories = await Story.find({
      user: { $in: allowedUsers },
      expiresAt: { $gt: new Date() }
    })
      .populate("user", "userName")
      .sort({ createdAt: -1 });

    res.json(stories);

  } catch (err) {
    console.error("STORIES ERROR:", err);
    res.status(500).json({ message: "Stories fetch failed" });
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
