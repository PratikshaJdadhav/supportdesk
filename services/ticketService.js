function createTicketService(ticketsRepository) {
  return {
    createTicket({ title, description, priority, user }) {
      return ticketsRepository.createTicket({
        title,
        description,
        status: "open",
        priority: priority || "medium",
        user: user || "Unknown"
      });
    }
  };
}

module.exports = { createTicketService };
