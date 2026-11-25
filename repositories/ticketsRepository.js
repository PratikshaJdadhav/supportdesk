function createTicketsRepository() {
  const tickets = [
    { id: 1, title: "Login problem", description: "Cannot log in", status: "open", priority: "high", user: "Asha" },
    { id: 2, title: "Page is slow", description: "Dashboard loads slowly", status: "open", priority: "low", user: "Rahul" },
    { id: 3, title: "Email issue", description: "Email is not sending", status: "closed", priority: "medium", user: "Neha" }
  ];
  let nextId = 4;

  return {
    getTickets() {
      return tickets;
    },
    findTicket(id) {
      return tickets.find(function(ticket) {
        return ticket.id === Number(id);
      });
    },
    createTicket(ticket) {
      const newTicket = { id: nextId, ...ticket };
      tickets.push(newTicket);
      nextId++;
      return newTicket;
    },
    deleteTicket(id) {
      const numericId = Number(id);
      const index = tickets.findIndex(function(ticket) {
        return ticket.id === numericId;
      });

      if (index !== -1) {
        tickets.splice(index, 1);
      }
    }
  };
}

module.exports = { createTicketsRepository };
