const path = require('path');
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');
const isEmpty = require('../../validations/is-empty');
const Validator = require('validator');
// Load models
const Product = require('../../controllers/product.controller');

//load Validation
const validateProduct = require('../../validations/register-product');

const validatePrice = require('../../validations/register-price');

/**************************************************
// * POST routes
****************************************************/
//@route    POST api/products/register
//@desc     Register a product
//@access   Private
router.post('/register', (req, res) => {
	//Check Validation
	const { errors, isValid } = validateProduct(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}

	//Create the status object
	let newproduct = {
		productId: req.body.id.toLowerCase(),
		desc: req.body.desc.toUpperCase(),
		whoCreated: req.body.who.toUpperCase(),
	};

	Product.findProduct(newproduct).then(product => {
		if (product === null) {
			//If product is null, product does not exist, so we can
			//continue and save to the db
			Product.saveProduct(newproduct)
				.then(product => {
					res.status(200).json(product);
				})
				.catch(err => {
					console.log(err);
					res.status(400).json({ err: 'Error, saving to the db.' });
				});
		} else {
			//Else, if the product exist, send an error.
			res.status(400).json({ err: 'Error, that product already exist.' });
		}
	});
});

//@route    POST api/products/assign
//@desc     Assign a single product and price to a customer
//@access   Private
router.post('/assign', (req, res) => {
	//Check Validation
	const { errors, isValid } = validatePrice(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}

	//Create the status object
	let price = {
		price: req.body.price,
		whoCreated: req.body.who,
		CustomerId: req.body.cust,
		ProductId: req.body.prodid,
	};

	Product.assignPrice(price)
		.then(price => {
			res.status(200).json(price);
		})
		.catch(err => {
			console.log(err);
			res.status(400).json({ err: 'Error saving price to the db.' });
		});
});

/**************************************************
// * PUT routes
****************************************************/
//@route    PUT api/products/update
//@desc     Update a product description
//@access   Private
router.put('/update', (req, res) => {
	if (isEmpty(req.body.desc)) {
		res.status(500).json({ error: 'Product description is required.' });
	} else {
		let updateThisProduct = {
			productId: req.body.id.toLowerCase(),
			desc: req.body.desc.toUpperCase(),
			whoUpdated: req.body.who.toUpperCase(),
		};

		Product.updateProduct(updateThisProduct)
			.then(updatedProduct => {
				res.status(200).json(updatedProduct);
			})
			.catch(err => {
				res.status(400).json({ err: 'Error updating the product.' });
			});
	}
});

//@route    PUT api/products/updateprice
//@desc     Update a customer's price for a signle product
//@access   Private
router.put('/updateprice', (req, res) => {
	//Check Validation
	const { errors, isValid } = validatePrice(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}

	//Create the status object
	let updateThisPrice = {
		price: req.body.price,
		whoUpdated: req.body.who,
		CustomerId: req.body.cust,
		ProductId: req.body.prodid,
	};

	Product.updateCustomerPrice(updateThisPrice)
		.then(updatedPrice => {
			res.status(200).json(updatedPrice);
		})
		.catch(err => {
			res.status(400).json({ err: 'Error updating the product.' });
		});
});

/**************************************************
// * GET routes
****************************************************/
//@route    GET api/products/getall
//@desc     Get all products
//@access   Private
router.get('/getall', (req, res) => {
	Product.getProducts()
		.then(listofproducts => {
			res.status(200).json(listofproducts);
		})
		.catch(err => {
			res.status(400).json(err);
		});
});

module.exports = router;
