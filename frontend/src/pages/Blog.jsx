import React, { useState } from 'react';
import { Calendar, User, Clock, ArrowRight, TrendingUp, Lightbulb, Target, Shield } from 'lucide-react';

const mockBlogs = [
  {
    id: 1,
    title: "Mastering Personal Finance in 2024",
    excerpt: "Discover the most effective strategies to manage your income and expenses efficiently in today's economy.",
    category: "Finance Tips",
    author: "Alex Morgan",
    date: "Aug 15, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: <TrendingUp size={16} />
  },
  {
    id: 2,
    title: "How to Build a Solid Emergency Fund",
    excerpt: "Step-by-step guide on setting aside savings for unexpected expenses without feeling the pinch on your lifestyle.",
    category: "Savings",
    author: "Jamie Lee",
    date: "Sep 02, 2024",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: <Shield size={16} />
  },
  {
    id: 3,
    title: "Understanding Investment Basics",
    excerpt: "A beginner's guide to growing your wealth through smart, safe, and diversified investments over time.",
    category: "Investing",
    author: "Chris Evans",
    date: "Oct 10, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: <Lightbulb size={16} />
  },
  {
    id: 4,
    title: "Tracking Expenses: The Ultimate Guide",
    excerpt: "Why tracking every penny can lead to massive long-term financial success and reduce money-related stress.",
    category: "Budgeting",
    author: "Sarah Connor",
    date: "Oct 25, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    icon: <Target size={16} />
  }
];

export const Blog = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <div className="animate-fade-in blog-page-container">
      <div className="header">
        <h2>Financial Insights & Blog</h2>
        <p className="blog-subtitle">
          Latest articles, strategies, and tips to help you achieve your financial goals.
        </p>
      </div>

      <div className="blog-grid">
        {mockBlogs.map((blog, index) => (
          <div 
            key={blog.id} 
            className={`blog-card stagger-${index % 3 + 1} glass-panel`}
            onMouseEnter={() => setHoveredCard(blog.id)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="blog-image-wrapper">
              <img 
                src={blog.image} 
                alt={blog.title} 
                className={`blog-image ${hoveredCard === blog.id ? 'zoomed' : ''}`} 
              />
              <div className="blog-category-badge">
                {blog.icon}
                <span>{blog.category}</span>
              </div>
            </div>
            
            <div className="blog-content">
              <div className="blog-meta">
                <span className="meta-item"><Calendar size={14} /> {blog.date}</span>
                <span className="meta-dot">•</span>
                <span className="meta-item"><Clock size={14} /> {blog.readTime}</span>
              </div>
              
              <h3 className="blog-title">{blog.title}</h3>
              <p className="blog-excerpt">{blog.excerpt}</p>
              
              <div className="blog-footer">
                <div className="blog-author">
                  <div className="author-avatar">
                    <User size={16} />
                  </div>
                  <span className="author-name">{blog.author}</span>
                </div>
                
                <button className="read-more-btn">
                  Read More <ArrowRight size={16} className={`arrow-icon ${hoveredCard === blog.id ? 'move-right' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
