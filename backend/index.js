import express from "express";
import cors from "cors";
import pg, { Client, Pool } from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import dotenv from "dotenv";
import pgSession from "connect-pg-simple";

const app = express();
app.set("trust proxy", 1);
const port = 3001;
const saltRounds = 10;

dotenv.config();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:3000",
  "https://expense-splitter-xi-two.vercel.app",
];

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(cors({
  origin: "https://expense-splitter-xi-two.vercel.app", // exact domain only
  credentials: true
}));


const PgSession = pgSession(session);

const db = new Pool({
  connectionString: process.env.string,
});

app.use(
  session({
    store: new PgSession({
      pool: db,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: true, //false-localhost //else-true
      sameSite: "none",//lax-localhost // none
      httpOnly: true
    },
  })
);

// const db = new pg.Client({
//     user: process.env.user,
//     host: process.env.host,
//     password: process.env.password,
//     database: process.env.database,
//     port: process.env.port
// });

db.connect();
const createTables = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        phone VARCHAR(15) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        group_name VARCHAR(100) NOT NULL,
        created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (group_name, created_by)
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        sent_from INTEGER REFERENCES users(id) ON DELETE SET NULL,
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS group_members (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE (group_id, user_id)
      );

      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
        paid_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (group_id, name)
      );

      CREATE TABLE IF NOT EXISTS expenses_history (
        id SERIAL PRIMARY KEY,
        expense_id INTEGER NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
        paye_name TEXT NOT NULL,
        names TEXT[] NOT NULL,
        description TEXT,
        amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
        members_count NUMERIC NOT NULL CHECK (amount > 0),
        created_on TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ All tables created successfully.");
  } catch (err) {
    console.error("❌ Error creating tables:", err);
  }
};

createTables();

app.get("/", (req, res) => {
  res.send("hello");
});

app.post("/register", async (req, res) => {
  let { name, email, phone, username, password } = req.body.reg;
  username = username.trim();
  name = name.trim();
  email = email.trim();

  try {
    const hash = await bcrypt.hash(password, saltRounds);

    await db.query(
      `INSERT INTO user (name, username, email, phone, password)
        VALUES ($1, $2, $3, $4, $5)`,
      [name, username, email, phone, hash]
    );

    return res.status(201).json({ message: "Registered successfully!" });
  } catch (err) {
    if (err.code === "23505") {
      if (err.constraint === "users_username_key") {
        return res
          .status(409)
          .json({ type: "username", error: "Username already exists" });
      } else if (err.constraint === "users_email_key") {
        return res
          .status(409)
          .json({ type: "email", error: "Email already exists" });
      } else if (err.constraint === "users_phone_key") {
        return res
          .status(409)
          .json({ type: "phone", error: "Phone number already exists" });
      }
    }

    return res.status(500).json({
      type: "server",
      error: "Something went wrong. Please try again later!",
    });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body.log;

  try {
    const result = await db.query(`SELECT * FROM users WHERE email = $1`, [
      email,
    ]);

    if (result.rows.length > 0) {
      const user = result.rows[0];

      bcrypt.compare(password, user.password, async (err, match) => {
        if (err) {
          return res
            .status(505)
            .send({ error: "Something went wrong. Please try again later!" });
        }

        if (match) {
          req.session.user = {
            id: user.id,
            email: user.email,
            name: user.name,
            username: user.username,

          };

          console.log("🟢 Before session.save:", req.session);

          req.session.save((err) => {
            if (err) {
              console.error("🔴 Session save error:", err);
              return res.status(500).send({
                error: "Something went wrong. Please try again later!",
              });
            }
            console.log("✅ Session saved successfully:", req.session);
            return res.status(200).json({ redirect: "/home" });
          });
        } else {
          return res.status(401).send({ error: "Invalid password!" });
        }
      });
    } else {
      return res.status(404).send({ error: "User not found" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ error: "Something went wrong. Please try again later!" });
  }
});

//verify login
app.get("/verify", (req, res) => {
  console.log("Verify session:", req.session);
  res.send({ data: req.session.user || null });
});

//logout
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Could not log out");
    }
    res.clearCookie("connect.sid");
    res.send({ message: "Logged out successfully" });
  });
});

// create group
app.post("/CreateGroup", async (req, res) => {
  const result = req.body;
  const groupName = result.GroupName.trim();

  try {
    const rest = await db.query(
      `INSERT INTO groups (group_name, created_by) VALUES ($1, $2) RETURNING *`,
      [groupName, result.id]
    );
    const groupId = rest.rows[0].id;
    await db.query(
      `INSERT INTO group_members (group_id, user_id) VALUES($1,$2)`,
      [groupId, result.id]
    );
    res.send({
      message: "Group Created Successfully!",
      id: rest.rows[0].id,
      name: rest.rows[0].group_name,
    });
  } catch (err) {
    res.status(409).send("Group Name already Taken");
  }
});

app.post("/getGroup", async (req, res) => {
  const result = req.body.id;
  try {
    const data = await db.query(
      `SELECT id, group_name FROM groups WHERE created_by = $1 ORDER BY id ASC`,
      [result]
    );
    res.send({ data: data.rows });
  } catch (err) {
    res.send(err);
  }
});

//delete group
app.delete("/deleteGroup", async (req, res) => {
  const id = req.body.id;
  try {
    await db.query(`DELETE FROM groups WHERE id = $1`, [id]);
    res.send("Group deleted successfully!");
  } catch (err) {
    console.log(err);
    res.send("Error Fetching Data!");
  }
});

//send Invite
app.post("/sendInvite", async (req, res) => {
  const { groupId, group_name, input, sent_from } = req.body.data;
  const user = input.trim().toLowerCase();
  try {
    const result = await db.query(
      `SELECT id FROM users WHERE LOWER(email) = $1 OR LOWER(username) = $1`,
      [user]
    );
    const users = result.rows[0];

    if (users) {
      const userId = users.id;

      // Checking Already in Group or Not
      const group_member = await db.query(
        `SELECT id FROM group_members WHERE group_id = $1 AND user_id = $2`,
        [groupId, userId]
      );

      if (group_member.rows[0]) {
        res.send({ message: "Already a group member" });
      } else {
        // checking if notifiction already sent or not
        const check_sent = await db.query(
          `SELECT id FROM notifications WHERE user_id = $1 AND group_id = $2`,
          [userId, groupId]
        );
        if (check_sent.rows[0]) {
          res.status(501).send("Invite already Sent!");
        } else {
          await db.query(
            `INSERT INTO notifications(user_id, sent_from, group_id, message) VALUES ($1, $2, $3, $4)`,
            [userId, sent_from, groupId, group_name]
          );
          res.send("Invite sent successfully!");
        }
      }
    } else {
      res.status(404).send("Enter valid username or email!");
    }
  } catch (err) {
    console.log(err);
  }
});

//To get notication
app.post("/getNotifications", async (req, res) => {
  const userId = req.body.userId;
  try {
    const result = await db.query(
      `SELECT * FROM (SELECT notifications.user_id,notifications.id as notification_id, users.email AS sender_email, users.name as sender_name, notifications.message, notifications.group_id FROM users INNER JOIN notifications ON users.id = notifications.sent_from) AS MEOW WHERE USER_ID= $1`,
      [userId]
    );
    res.send(result.rows);
  } catch (err) {
    console.log(err);
  }
});

//delete Request
app.delete("/deleteRequest", async (req, res) => {
  const id = req.body.notification_id;
  try {
    await db.query(`DELETE FROM notifications WHERE id = $1`, [id]);
    res.send("Deleted Successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Deleteing notification");
  }
});

//accept Request
app.post("/acceptRequest", async (req, res) => {
  const { userId, groupId } = req.body.data;
  try {
    await db.query(
      `INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)`,
      [groupId, userId]
    );
    res.send("Successfully joined the group!");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error Please try again later");
  }
});

//get Accepted Groups
app.post("/getAcceptedGroups", async (req, res) => {
  const userId = req.body.userId;
  try {
    const result = await db.query(
      `SELECT * FROM (SELECT group_members.id as accepted_group_id, groups.id as group_id, groups.created_by as created_user_id, group_members.user_id,groups.group_name FROM groups INNER JOIN group_members ON group_members.group_id = groups.id) AS MEOW WHERE user_id = $1`,
      [userId]
    );
    const accepted_groups = result.rows;
    res.send({ message: "successfully loaded data", accepted_groups });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error loading data");
  }
});

//leave Group
app.delete("/LeaveGroup", async (req, res) => {
  const id = req.body.id;
  try {
    await db.query(`DELETE FROM group_members WHERE id = $1`, [id]);
    res.send("Successfully left the group!");
  } catch (err) {
    res.status(500).send("server not responding please try again later");
  }
});

//Expenses managing

//add new Expense
app.post("/addNewExpense", async (req, res) => {
  const { name, description, amount, groupId, paid_by } = req.body.newExpense;

  try {
    await db.query(
      `INSERT INTO expenses (group_id, paid_by, name, description, amount) values ($1, $2, $3, $4, $5)`,
      [groupId, paid_by, name, description, amount]
    );
    res.send("Expense added successfully!");
  } catch (err) {
    res.status(400).send("Expense name already exists in this group!");
  }
});

app.post("/getGroupMembers", async (req, res) => {
  const id = req.body.groupId;
  try {
    const result = await db.query(
      `SELECT * FROM (SELECT m.group_id, m.user_id, u.name, u.username FROM group_members m INNER JOIN groups g on m.group_id = g.id INNER JOIN users u on u.id = m.user_id) as members WHERE group_id = $1 ORDER BY name`,
      [id]
    );
    res.send({ members: result.rows });
  } catch (err) {
    res.status(502).send("Error geting data");
  }
});

//get expense details
app.post("/getActiveExpenses", async (req, res) => {
  const groupId = req.body.groupId;
  try {
    const result = await db.query(
      "SELECT * FROM (SELECT e.id,e.group_id, e.name, e.description, e.amount, e.amount, e.created_at, e.paid_by, u.name as paye_name FROM expenses e INNER JOIN users u ON e.paid_by = u.id) as expenses WHERE group_id = $1",
      [groupId]
    );
    const members = await db.query(
      "SELECT * FROM (SELECT u.id as user_id, u.name, e.id as expense_id, e.group_id FROM expenses e INNER JOIN group_members m ON e.group_id = m.group_id INNER JOIN users u ON m.user_id = u.id) as expense_detail WHERE group_id = $1 ORDER BY name",
      [groupId]
    );
    res.send({ expenses: result.rows, members: members.rows });
  } catch (err) {
    console.log(err);
  }
});

//delete Expense
app.delete("/deleteExpense", async (req, res) => {
  const id = req.body.ExpenseId;
  try {
    await db.query("DELETE FROM expenses WHERE id = $1", [id]);
    res.send("Expense deleted successfully!");
  } catch (err) {
    res.status(505).send("Error deleting expense. try again later!");
  }
});

//settle expenses and add to history table
app.post("/Settle", async (req, res) => {
  const { expense, amount_per_person, groupmembers, members_count } = req.body;
  try {
    await db.query(
      "INSERT INTO expenses_history (expense_id, name, group_id, paye_name, names, description, amount, members_count, created_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)",
      [
        expense.id,
        expense.name,
        expense.group_id,
        expense.paye_name,
        groupmembers,
        expense.description,
        amount_per_person,
        members_count,
        expense.created_at,
      ]
    );
    res.send("Successfully settled the expense!");
  } catch (err) {
    console.log(err);
    res.status(505).send("Error");
  }
});

//Get Exiting Expense History
app.post("/getExpenseHistory", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM expenses_history WHERE group_id = $1",
      [req.body.groupId]
    );
    res.send(result.rows);
  } catch (err) {
    console.log(err);
  }
});
//Accept Notification
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
