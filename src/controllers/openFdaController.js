import axios from "axios";
import { query } from "express-validator";

export const fetchData = async (req, res) => {
  const { item } = req.query;
  if (!item) {
    return res.render("search", { error: "Please enter a drug name!" });
  }
  const url = "https://api.fda.gov/drug/label.json";
  try {
    const response = await axios.get(url, {
      params: {
        search: `openfda.brand_name:"${item}" OR openfda.generic_name:"${item}"`,
        limit: 1,
      },
      timeout: 100000,
    });

    const result = response.data.results[0];

    const drugInfo = {
      brandName: result.openfda?.brand_name?.[0] || "Not Available",
      genericName: result.openfda?.generic_name?.[0] || "Not Available",
      manufacturer: result.openfda?.manufacturer?.[0] || "Not Available",
      purpose:
        result.openfda?.purpose?.[0] ||
        result.openfda?.indications_and_usage?.[0] ||
        "No Purpose",
      boxedWarnings: result.openfda?.boxed_warnings?.[0] || null,
      warnings: result.openfda?.warnings?.[0] || "No general warnings listed",
    };

    res.render("result", { drug: drugInfo, query: item });
  } catch (error) {
    console.error("General Error:", error.message);
    if (error.response && error.response.status === 404) {
      // 404 from openFDA means no matching records found
      return res.render("search", {
        error: `No safety records found for "${item}". Please check the spelling.`,
      });
    }

    console.error("openFDA API Error:", error.message);
    res.render("search", {
      error: "Failed to retrieve drug safety data. Please try again later.",
    });
  }
};
