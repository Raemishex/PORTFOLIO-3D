// Read Dashboard.jsx and inject the AdminLiveChat component.
const fs = require('fs');

const dashboardPath = 'src/pages/Dashboard.jsx';
let dashboardContent = fs.readFileSync(dashboardPath, 'utf8');

// Import AdminLiveChat
dashboardContent = dashboardContent.replace(
  "import './Dashboard.css';",
  "import './Dashboard.css';\nimport AdminLiveChat from '../components/UI/AdminLiveChat';"
);

// Inject component before the closing </div> of dashboard-container
dashboardContent = dashboardContent.replace(
  "        </div>\n      </motion.div>\n    </div>\n  );\n};\n\nexport default Dashboard;",
  "        </div>\n        <AdminLiveChat />\n      </motion.div>\n    </div>\n  );\n};\n\nexport default Dashboard;"
);

fs.writeFileSync(dashboardPath, dashboardContent, 'utf8');
