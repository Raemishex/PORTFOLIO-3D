const fs = require('fs');

// The best way to implement "Visitor to Admin" chat:
// We can use a special room or namespace in socket.io for "admin".
// If the user isn't logged in, they are assigned a random session ID.
// Admin logs in and joins 'admin' room.
