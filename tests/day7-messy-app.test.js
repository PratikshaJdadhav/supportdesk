const assert = require("node:assert/strict");
const { once } = require("node:events");
const http = require("node:http");
const test = require("node:test");
const { createApp } = require("../day7-messy-app");

async function startServer() {
  const server = createApp().listen(0);
  await once(server, "listening");
  return server;
}

async function request(server, path, method, body) {
  const address = server.address();
  const payload = body === undefined ? undefined : JSON.stringify(body);
  const options = {
    hostname: "127.0.0.1",
    port: address.port,
    path,
    method,
    headers: payload
      ? {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload)
        }
      : {}
  };

  return new Promise(function(resolve, reject) {
    const req = http.request(options, function(res) {
      let responseBody = "";
      res.setEncoding("utf8");
      res.on("data", function(chunk) {
        responseBody += chunk;
      });
      res.on("end", function() {
        resolve({
          status: res.statusCode,
          body: responseBody ? JSON.parse(responseBody) : undefined
        });
      });
    });

    req.on("error", reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function withServer(run) {
  const server = await startServer();
  try {
    await run(server);
  } finally {
    server.close();
    await once(server, "close");
  }
}

test("POST /tickets creates a ticket with existing defaults and response", async function() {
  await withServer(async function(server) {
    const response = await request(server, "/tickets", "POST", {
      title: "Cannot sign in",
      description: "Login fails"
    });

    assert.equal(response.status, 201);
    assert.deepEqual(response.body, {
      success: true,
      message: "Ticket created successfully",
      data: {
        id: 4,
        title: "Cannot sign in",
        description: "Login fails",
        status: "open",
        priority: "medium",
        user: "Unknown"
      }
    });

    const listed = await request(server, "/tickets/4", "GET");
    assert.equal(listed.status, 200);
    assert.deepEqual(listed.body.data, response.body.data);
  });
});

test("POST /tickets preserves supplied priority and user", async function() {
  await withServer(async function(server) {
    const response = await request(server, "/tickets", "POST", {
      title: "Email issue",
      description: "Messages fail to send",
      priority: "high",
      user: "Asha"
    });

    assert.equal(response.status, 201);
    assert.equal(response.body.data.priority, "high");
    assert.equal(response.body.data.user, "Asha");
  });
});

test("existing ticket routes operate on tickets created through POST", async function() {
  await withServer(async function(server) {
    const created = await request(server, "/tickets", "POST", {
      title: "Profile issue",
      description: "Cannot update profile"
    });
    const ticketId = created.body.data.id;

    const list = await request(server, "/tickets", "GET");
    assert.equal(list.status, 200);
    assert.equal(list.body.count, 4);
    assert.equal(list.body.data[3].id, ticketId);

    const updated = await request(server, "/tickets/" + ticketId, "PUT", {
      title: "Updated profile issue"
    });
    assert.equal(updated.status, 200);
    assert.equal(updated.body.data.title, "Updated profile issue");

    const closed = await request(server, "/tickets/" + ticketId + "/close", "PATCH");
    assert.equal(closed.status, 200);
    assert.equal(closed.body.data.status, "closed");

    const deleted = await request(server, "/tickets/" + ticketId, "DELETE");
    assert.equal(deleted.status, 200);
    assert.deepEqual(deleted.body, {
      success: true,
      message: "Ticket deleted successfully"
    });

    const missing = await request(server, "/tickets/" + ticketId, "GET");
    assert.equal(missing.status, 404);
    assert.deepEqual(missing.body, {
      success: false,
      message: "Ticket not found"
    });
  });
});

test("POST /tickets keeps the existing validation response and does not create a ticket", async function() {
  await withServer(async function(server) {
    const response = await request(server, "/tickets", "POST", {
      title: "",
      description: "Missing title"
    });

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, {
      success: false,
      message: "Title and description are required"
    });

    const created = await request(server, "/tickets", "POST", {
      title: "Valid ticket",
      description: "Still receives the first available ID"
    });
    assert.equal(created.body.data.id, 4);
  });
});
