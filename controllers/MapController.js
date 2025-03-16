const mapService = require("../services/MapService");

/**
 * Controller to fetch route between shipper, restaurant, and customer.
 */
const getRoute = async (req, res) => {
  try {
    const { shipper, restaurant, customer } = req.body;

    if (!shipper || !restaurant || !customer) {
      return res.status(400).json({ message: "Missing required locations." });
    }

    const route = await mapService.fetchRoute(shipper, restaurant, customer);
    res.status(200).json({ route });
  } catch (error) {
    res.status(500).json({ message: "Error fetching route", error: error.message });
  }
};

const getDistance = async (req, res) => {
  try {
    const { address1, address2 } = req.query;

    if (!address1 || !address2) {
      return res.status(400).json({ message: "Both addresses are required." });
    }

    const { distance, duration } = await mapService.getDistanceBetweenAddresses(address1, address2);
    res.status(200).json({ distance: distance , duration: duration});
  } catch (error) {
    res.status(500).json({ message: "Error calculating distance", error: error.message });
  }
};

/**
 * Controller to get coordinates from an address.
 */
const getCoordinates = async (req, res) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ message: "Address is required." });
    }

    const coordinates = await mapService.getCoordinatesFromAddress(address);
    res.status(200).json({ coordinates });
  } catch (error) {
    res.status(500).json({ message: "Error fetching coordinates", error: error.message });
  }
};

module.exports = { getRoute, getDistance, getCoordinates };
