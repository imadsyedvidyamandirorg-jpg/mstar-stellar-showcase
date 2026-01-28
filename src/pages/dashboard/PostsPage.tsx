import { Image, Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const PostsPage = () => {
  const posts = [
    {
      id: 1,
      title: "New Samsung Galaxy S24 Ultra In Stock!",
      content: "Experience the ultimate smartphone with AI-powered features, stunning camera, and powerful performance. Available now at MStar Mobile! 📱✨",
      date: "2 hours ago",
      likes: 234,
      comments: 45,
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=400&fit=crop",
    },
    {
      id: 2,
      title: "Weekend Special: 20% Off All Accessories!",
      content: "Get amazing deals on phone cases, chargers, earphones, and more! This weekend only. Visit us or shop online. 🎉🛍️",
      date: "1 day ago",
      likes: 567,
      comments: 89,
      image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&h=400&fit=crop",
    },
    {
      id: 3,
      title: "iPhone 15 Pro Max Available!",
      content: "The wait is over! iPhone 15 Pro Max is now available at MStar Mobile. Titanium design, 5x optical zoom, and Action button. Come get yours! 🍎",
      date: "3 days ago",
      likes: 890,
      comments: 156,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=400&fit=crop",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Posts & Updates</h1>
        <p className="text-muted-foreground">Latest news and announcements from MStar Mobile</p>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-card rounded-2xl shadow-elegant overflow-hidden"
          >
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-sm">M</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">MStar Mobile</p>
                  <p className="text-xs text-muted-foreground">{post.date}</p>
                </div>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </div>

            {/* Post Image */}
            <div className="aspect-video bg-muted">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Post Actions */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors">
                  <Heart className="h-6 w-6" />
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle className="h-6 w-6" />
                </button>
                <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Share2 className="h-6 w-6" />
                </button>
              </div>
              <p className="mt-2 text-sm font-medium text-foreground">
                {post.likes.toLocaleString()} likes • {post.comments} comments
              </p>
            </div>

            {/* Post Content */}
            <div className="p-4">
              <h3 className="font-semibold text-foreground mb-2">{post.title}</h3>
              <p className="text-muted-foreground">{post.content}</p>
            </div>
          </article>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Load More Posts
        </Button>
      </div>
    </div>
  );
};

export default PostsPage;
