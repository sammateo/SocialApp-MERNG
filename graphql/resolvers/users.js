const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { SECRET_KEY } = require("../../config");
module.exports = {
	Mutation: {
		async register(
			_,
			{ registerInput: { username, email, password, confirmPassword } },
			context,
			info
		) {
			//validate user data
			//Make sure user doesnt already exist
			//hash password and create auth token
			password = await bcrypt.hash(password, 12);

			const newUser = new User({
				email,
				username,
				password,
				createdAt: new Date().toISOString(),
			});

			const res = await newUser.save();
			const token = jwt.sign(
				{
					id: res.id,
					email: res.email,
					username: res.username,
				},
				SECRET_KEY,
				{ expiresIn: "1h" }
			);

			return {
				...res._doc,
				id: res.id,
				token,
			};
		},
	},
};
