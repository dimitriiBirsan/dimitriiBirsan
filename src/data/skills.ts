export const skills = {
    frontendSkills: [
        {
            name: "React.js Ecosystem",
            children: [
                { name: "React Hooks & Router" },
                { name: "React Flow / Konva" },
                { name: "React Query" },
                { name: "MUI (Material-UI)" },
                { name: "i18next (Internationalization)" } // Added based on
            ]
        },

        {
            name: "HTML5, CSS3 & Preprocessors",
            children: [
                { name: "Scss / Dart Sass", children: [{ name: "BEM Standard" }] }, // Refined based on
                { name: "Tailwind CSS" }
            ]
        },
        {
            name: "Build Tools & Templating", // New Category
            children: [
                { name: "Vite / Webpack" }, // Webpack added
                { name: "EJS / Handlebars" }, // Added based on
                { name: "Astro" }
            ]
        },
        {
            name: "Desktop Development", // New Category
            children: [
                { name: "Electron" } // Added based on
            ]
        },
    ],

    backendSkills: [
        {
            name: "Node.js Environment",
            children: [
                { name: "Express.js" },
                { name: "MVC Architecture" }, // MVC inferred from
                { name: "Swagger (API Documentation)" }, // Added based on
                { name: "JWT / OAuth 2.0" } // OAuth added
            ]
        },
        {
            name: "Languages",
            children: [
                { name: "Python" },
                { name: "Hugo" },
                { name: "TypeScript" },
                { name: "C#" }
            ]
        },
        {
            name: "IoT & Real-Time Protocols", // New Category - Very strong in your CV
            children: [
                { name: "MQTT" }, // Added based on
                { name: "Socket.io / TCP / Serial" }, // TCP/Serial added
                { name: "WCF (Secure Communication)" } // Added based on
            ]
        },
        {
            name: "Databases & ORM",
            children: [
                { name: "MySQL" },
                { name: "Microsoft SQL" },
                { name: "PostgreSQL" },
                { name: "SQLite" },
                { name: "Sequelize / Prisma" }
            ]
        },
    ],

    infrastructureSkills: [
        {
            name: "DevOps & Cloud",
            children: [
                { name: "Docker" },
                { name: "Azure DevOps" }, // Added based on
                { name: "Azure Storage" }, // Added based on
                { name: "Jenkins" }, // Added based on
                { name: "RabbitMQ / Microservices" }, // Added based on
                { name: "CI/CD Pipelines" }
            ]
        },
        {
            name: "Testing",
            children: [
                { name: "Cypress (E2E)" },
                { name: "Vitest" },
                { name: "Jest" }
            ]
        },
        {
            name: "Version Control",
            children: [
                { name: "Git & Bitbucket" }
            ]
        }
    ]
}