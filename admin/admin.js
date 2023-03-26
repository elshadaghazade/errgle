const models = require("../db_Config/models");
const { User } = require("../db_Config/models").default;
const bcrypt = require("bcryptjs");

const AdminBro = require("admin-bro");
const AdminBroExpress = require("@admin-bro/express");
const AdminBroMongoose = require("@admin-bro/mongoose");

AdminBro.registerAdapter(AdminBroMongoose);

// const canModifyUsers = ({ currentAdmin }) => currentAdmin && currentAdmin.role === 'admin'

const adminBro = new AdminBro({
  databases: [models],
  branding: {
    companyName: "Admin Panel",
  },
  rootPath: "/admin",
  resources: [
    {
      resource: User,
      options: {
        listProperties: ["email", "_id", "firstname", "lastname", "role"],
        properties: {
          updated_at: {
            isVisible: { list: false, filter: false, show: true, edit: false },
          },
          created_at: {
            isVisible: { list: false, filter: false, show: true, edit: false },
          },
          encryptedPassword: { isVisible: false },
          password: {
            type: "string",
            position: 102,
            isVisible: {
              list: false,
              edit: true,
              filter: false,
              show: false,
            },
          },
        },
        actions: {
          //   edit: { isAccessible: canModifyUsers },
          //   delete: { isAccessible: canModifyUsers },
          //   new: { isAccessible: canModifyUsers }
          new: {
            before: async (request) => {
              if (request.payload.password) {
                request.payload = {
                  ...request.payload,
                  encryptedPassword: await bcrypt.hash(
                    request.payload.password,
                    10
                  ),
                  password: undefined,
                };
              }
              return request;
            },
          },
          edit: {
            before: async (request) => {
              console.log(request);
              if (request.payload.password) {
                request.payload = {
                  ...request.payload,
                  encryptedPassword: await bcrypt.hash(
                    request.payload.password,
                    10
                  ),
                  password: undefined,
                };
              }
              return request;
            },
          },
        },
      },
    },
  ],
});

const router = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await User.findOne({ email });
    if (user && user.role === "admin") {
      const matched = await bcrypt.compare(password, user.encryptedPassword);
      if (matched) {
        return user;
      }
    }
    return false;
  },
  cookiePassword: "thisIsOurLittleSecret",
});

module.exports = {
  router,
  adminBro,
};
