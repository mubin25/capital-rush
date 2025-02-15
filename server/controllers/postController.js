const admin = require("firebase-admin");
const db = admin.firestore();

exports.createPost = async (req, res) => {
  const { title, description } = req.body;
  const post = { title, description, userId: req.user.uid, createdAt: new Date() };
  const docRef = await db.collection("posts").add(post);
  res.json({ id: docRef.id, ...post });
};

exports.getPosts = async (req, res) => {
  const snapshot = await db.collection("posts").orderBy("createdAt", "desc").get();
  res.json(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const postRef = db.collection("posts").doc(id);
  const post = await postRef.get();
  if (!post.exists || post.data().userId !== req.user.uid)
    return res.status(403).json({ message: "Unauthorized" });
  await postRef.update({ title, description });
  res.json({ id, title, description });
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  const postRef = db.collection("posts").doc(id);
  const post = await postRef.get();
  if (!post.exists || post.data().userId !== req.user.uid)
    return res.status(403).json({ message: "Unauthorized" });
  await postRef.delete();
  res.json({ message: "Post deleted" });
};