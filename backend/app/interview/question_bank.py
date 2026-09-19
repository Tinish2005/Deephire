TECHNICAL_QUESTIONS = {
    "python": [
        {
            "question": "What are Python decorators?",
            "answer": "A decorator is a function that takes another function as input and extends or modifies its behavior without changing its source code, typically applied using the @decorator syntax above a function definition."
        },
        {
            "question": "Explain list comprehension in Python.",
            "answer": "List comprehension is a concise way to create lists in Python by embedding a for loop and optional conditions inside square brackets, such as [x*x for x in range(10) if x % 2 == 0], instead of writing a multi-line loop."
        }
    ],
    "fastapi": [
        {
            "question": "What is dependency injection in FastAPI?",
            "answer": "Dependency injection in FastAPI is a pattern where required objects, such as database sessions, are declared as function parameters using Depends(), and FastAPI automatically resolves and injects them at request time."
        },
        {
            "question": "How is FastAPI different from Flask?",
            "answer": "FastAPI is built on Starlette and Pydantic, offering built-in async support, automatic data validation, and interactive API docs out of the box, while Flask is a simpler synchronous micro-framework that needs extra libraries for those features."
        }
    ],
    "react": [
        {
            "question": "What are React Hooks?",
            "answer": "React Hooks are functions like useState and useEffect that let developers use state and other React features inside functional components without writing class components."
        },
        {
            "question": "Explain the Virtual DOM.",
            "answer": "The Virtual DOM is an in-memory representation of the real DOM that React uses to calculate the most efficient way to update the actual DOM by comparing previous and current versions through a diffing process."
        }
    ],
    "java": [
        {
            "question": "Explain OOP principles in Java.",
            "answer": "Java's core OOP principles are encapsulation, inheritance, polymorphism, and abstraction, which let developers model entities as objects with bundled data and behavior, promote code reuse, and hide implementation details."
        },
        {
            "question": "What is the difference between JDK and JRE?",
            "answer": "The JDK includes tools for developing Java applications, such as the compiler, while the JRE only contains what's needed to run compiled Java programs, like the JVM and core libraries."
        }
    ],
    "sql": [
        {
            "question": "What is normalization?",
            "answer": "Normalization organizes database tables to reduce data redundancy and improve integrity by splitting large tables into smaller related ones and defining relationships between them."
        },
        {
            "question": "What is the difference between WHERE and HAVING?",
            "answer": "WHERE filters individual rows before any grouping happens, while HAVING filters groups of rows after a GROUP BY clause, typically used together with aggregate functions."
        }
    ],
    "flask": [
        {
            "question": "How does Flask routing work?",
            "answer": "Flask routing maps URL paths to Python functions using the @app.route() decorator, so when a client requests a matching URL, Flask calls the associated view function to generate a response."
        },
        {
            "question": "What are Flask Blueprints?",
            "answer": "Flask Blueprints organize an application into reusable, modular components by grouping related routes, templates, and static files that can be registered on the main app."
        }
    ]
}

BEHAVIORAL_QUESTIONS = [
    "Tell me about yourself.",
    "Describe a challenging project you worked on.",
    "Tell me about a time you solved a difficult problem."
]