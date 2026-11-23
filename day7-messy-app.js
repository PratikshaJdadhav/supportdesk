const express = require("express");
const { createTicketsController } = require("./controllers/ticketsController");
const { createTicketsRepository } = require("./repositories/ticketsRepository");
const { createTicketsRouter } = require("./routes/tickets");
const { createTicketService } = require("./services/ticketService");

function log(message) {
  console.log(new Date().toISOString() + " - " + message);
}

function createApp() {
  const app = express();
  const ticketsRepository = createTicketsRepository();
  const ticketService = createTicketService(ticketsRepository);
  const ticketsController = createTicketsController(ticketService, log);

  app.use(express.json());

  app.get("/", function(req, res) {
    res.send("SupportDesk API is running");
  });

  app.get("/tickets", function(req, res) {
    log("Getting all tickets");
    let result = ticketsRepository.getTickets();

    if (req.query.status) {
      result = result.filter(function(t) {
        return t.status === req.query.status;
      });
    }

    if (req.query.priority) {
      result = result.filter(function(t) {
        return t.priority === req.query.priority;
      });
    }

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });
  });

  app.get("/tickets/:id", function(req, res) {
    log("Getting ticket by ID");
    let ticket = ticketsRepository.findTicket(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  });

  app.use("/tickets", createTicketsRouter(ticketsController));

  app.put("/tickets/:id", function(req, res) {
    log("Updating ticket");
    let ticket = ticketsRepository.findTicket(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }

    if (req.body.title) {
      ticket.title = req.body.title;
    }

    if (req.body.description) {
      ticket.description = req.body.description;
    }

    if (req.body.priority) {
      ticket.priority = req.body.priority;
    }

    res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      data: ticket
    });
  });

  app.delete("/tickets/:id", function(req, res) {
    log("Deleting ticket");
    let ticket = ticketsRepository.findTicket(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }

    ticketsRepository.deleteTicket(req.params.id);

    res.status(200).json({
      success: true,
      message: "Ticket deleted successfully"
    });
  });

  app.patch("/tickets/:id/close", function(req, res) {
    log("Closing ticket");
    let ticket = ticketsRepository.findTicket(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found"
      });
    }

    if (ticket.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "Ticket is already closed"
      });
    }

    ticket.status = "closed";

    res.status(200).json({
      success: true,
      message: "Ticket closed successfully",
      data: ticket
    });
  });

  app.get("/health", function(req, res) {
    res.status(200).json({
      success: true,
      message: "Server is healthy"
    });
  });

  app.use(function(req, res) {
    res.status(404).json({
      success: false,
      message: "API endpoint not found"
    });
  });

  app.use(function(err, req, res, next) {
    log("Error: " + err.message);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  });

  return app;
}

const PORT = 3000;

if (require.main === module) {
  createApp().listen(PORT, function() {
    log("Server started on port " + PORT);
  });
}

module.exports = { createApp };