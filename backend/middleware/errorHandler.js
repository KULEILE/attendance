const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.message.includes('violates check constraint')) {
    return res.status(400).json({ 
      error: 'Invalid status value. Must be "Present" or "Absent".' 
    });
  }

  res.status(500).json({ 
    error: 'Something went wrong on the server!' 
  });
};

module.exports = errorHandler;