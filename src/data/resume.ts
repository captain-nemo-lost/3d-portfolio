export const resumeData = {
  name: "Abhimanyu Sharma",
  title: "AI Engineer & Full-Stack Developer",
  email: import.meta.env.VITE_EMAIL || "contact@example.com",
  phone: import.meta.env.VITE_PHONE_NUMBER || "1234567890",
  github: "https://github.com/captain-nemo-lost",
  linkedin: "https://www.linkedin.com/in/abhimanyu-sharma-7400353a1",
  portfolio: "https://sharma-abhimanyu.vercel.app",
  
  about: "B-Tech CSE student at BML Munjal University (2023-2027). Passionate about AI Engineering, LLMs, RAG Systems, and Backend Development. I specialize in building scalable architectures and integrating intelligent machine learning models into robust web applications. My goal is to continuously push the boundaries of what is possible with artificial intelligence while maintaining a deep focus on exceptional user experiences and clean, efficient code.",
  
  skills: {
    programming: ["C++", "Python", "Java", "JavaScript", "SQL", "HTML", "CSS"],
    frameworks: ["Node.js", "FastAPI", "NumPy", "Pandas", "Matplotlib", "Bootstrap", "React"],
    tools: ["GitHub", "VS Code", "Jupyter Notebook", "Android Studio", "MySQL", "MongoDB", "Postman", "Flutter"],
    concepts: ["Machine Learning", "AI Engineering", "LLMs", "RAG Systems", "Backend Development", "API Development", "Data Processing", "OOPs"]
  },
  
  experience: [
    {
      company: "Edatapoint (Tata AIA Life Insurance Project)",
      role: "Data Science Intern",
      date: "June 2025",
      points: [
        "Collaborated with the Data Science team to develop a predictive model identifying insurance protection gaps.",
        "Designed preprocessing, feature engineering, and model training pipelines using Python and ML techniques.",
        "Extracted behavioral and demographic insights from structured insurance datasets."
      ]
    },
    {
      company: "LENDINGIQ",
      role: "Backend Development Intern",
      date: "December 2025 – January 2026",
      points: [
        "Contributed to server-side development and financial data processing systems.",
        "Developed bank statement extractors to process and structure transaction data for downstream analysis.",
        "Designed and maintained backend APIs handling business logic and integration with frontend and external services.",
        "Assisted in database management and optimization ensuring reliable data storage and performance efficiency."
      ]
    }
  ],
  
  projects: [
    {
      title: "KATE (Knowledgeable AI Tactical Entity)",
      subtitle: "Multimodal AI Personal Assistant",
      date: "2026",
      image: "/projects/kate.png",
      tech: ["Python", "FastAPI", "React", "Groq (Llama 3)", "Gemini API", "OCR", "SQLite", "RAG"],
      points: [
        "Engineered a multimodal AI assistant capable of voice-controlled OS automation, contextual document retrieval, and intelligent task execution.",
        "Developed a hybrid intent-routing architecture combining local automation pipelines and LLM-powered task orchestration.",
        "Built a Retrieval-Augmented Generation (RAG) system featuring document chunking, vector embeddings, and semantic search.",
        "Designed an agentic task execution framework that decomposes complex user goals into multi-step tool chains."
      ]
    },
    {
      title: "Section Sense",
      subtitle: "Intelligent Legal Information Retrieval System",
      date: "2025",
      image: "/projects/section_sense.png",
      tech: ["Python", "FastAPI", "React", "NLP", "Transformers", "PostgreSQL"],
      points: [
        "Developed an AI-driven legal retrieval system that semantically maps user queries to relevant sections from Indian laws (BNS, BNSS, IT Act).",
        "Built an end-to-end pipeline including web scraping, preprocessing, embedding generation, and semantic similarity search.",
        "Implemented summarization and chatbot modules to provide conversational legal assistance."
      ]
    },
    {
      title: "CanvasX",
      subtitle: "AI-Powered Editable Design Platform with Blockchain Provenance",
      date: "2025",
      image: "/projects/canvasx.png",
      tech: ["React", "TypeScript", "Express.js", "Solidity", "Gemini API", "IPFS", "Ethereum", "Zustand"],
      points: [
        "Developed a full-stack AI-powered design platform that generates semantically editable SVG graphics from natural-language prompts.",
        "Designed a cryptographic edit provenance system using SHA-256 hash chains and Merkle trees to record creative edits.",
        "Integrated IPFS (Pinata) and Ethereum Sepolia smart contracts to mint ERC-721 NFTs storing prompt hashes and provenance metadata."
      ]
    },
    {
      title: "NEMO",
      subtitle: "Automated Job-Hunting Subagent",
      date: "2026",
      image: "/projects/nemo.png",
      tech: ["Python", "Playwright", "SQLite", "Asyncio", "LLMs"],
      points: [
        "Built a robust, automated job-hunting subagent using a Playwright-based pipeline to scrape job listings.",
        "Implemented strict title-based pre-filtering to eliminate irrelevant roles and ensure high-quality application targeting.",
        "Engineered an automated application bot featuring concurrent execution and asynchronous database tracking."
      ]
    },
    {
      title: "FinSight",
      subtitle: "AI Personal Finance Tracker",
      date: "2026",
      image: "/projects/finsight.png",
      tech: ["React", "Vite", "FastAPI", "SQLite", "Groq", "Tailwind CSS"],
      points: [
        "Architected a comprehensive personal finance dashboard with a Vite-powered React frontend and a local FastAPI/SQLite backend.",
        "Developed a high-performance Text-to-SQL financial assistant powered by Groq, allowing users to query financial data in natural language.",
        "Designed a responsive, dark-mode iMessage-style chat interface with strict SQL generation and user scoping capabilities."
      ]
    }
  ],

  achievements: [
    "Built and deployed multiple AI-powered applications using LLMs, RAG pipelines, and automation systems.",
    "Earned 50-Day LeetCode Streak Badge demonstrating consistency in problem-solving."
  ]
};
