function createTicketsController(ticketService, log) {
  return {
    createTicket(req, res) {
      log("Creating new ticket");
      const title = req.body.title;
      const description = req.body.description;

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          message: "Title and description are required"
        });
      }

      const newTicket = ticketService.createTicket({
        title,
        description,
        priority: req.body.priority,
        user: req.body.user
      });

      res.status(201).json({
        success: true,
        message: "Ticket created successfully",
        data: newTicket
      });
    }
  };
}

module.exports = { createTicketsController };
