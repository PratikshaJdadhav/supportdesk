const express = require("express");

function createTicketsRouter(ticketsController) {
  const router = express.Router();
  router.post("/", ticketsController.createTicket);
  return router;
}

module.exports = { createTicketsRouter };
