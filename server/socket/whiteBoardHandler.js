function handleWhiteboardEvents (socket) {
  console.log(`Initializing whiteboard events for socket: ${socket.id}`);

  socket.on('scene-update', (data) => {
    // Relay to all clients except the sender
    socket.broadcast.emit('scene-update', data);
    // console.log(`Scene update from ${socket.id}, broadcasting...`);
  });

  // Note: The 'disconnect' event is usually handled once per socket,
  // if you have a general disconnect handler in socket/index.js,
  // you might not need this one, or you can add specific cleanup here.
  // For now, let's keep it to see its effect.
  socket.on('disconnect', () => {
    console.log(`Whiteboard user disconnected: ${socket.id}`);
  });
};

export default handleWhiteboardEvents;

// app.post('/save', async (req,res) => {
//     const elements = req.body.elements;
//     try {
//         if (!elements){
//             return res.status(400).json({message: "Missing elements"})
//         }

//         const res = await pool.query('INSERT INTO whiteboard board VALUES ($1) RETURNING *',[elements]);
//         const data = res.rows[0];

//         return res.status(200).json({message: "Inserted Successfully", data: `${data}`});
//     } catch (error) {
//         console.log(error);
//     }
// })

