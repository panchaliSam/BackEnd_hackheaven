const userController = require("./user.controller");
const sponsorshipController = require("./sponsor.controller");
const innovatorController = require("./innovator.controller");
const hackathonController = require("./hackathon.controller");
const organizerController = require("./organizer.controller")
const authUserController = require("./auth.user.controller")

module.exports = {
    userController,
    sponsorshipController,
    innovatorController,
    hackathonController,
    authUserController,
    organizerController
}