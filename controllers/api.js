const fetch = require("node-fetch");
const endpoint = require("../key");

const fetchPostsWithQuery = async value => {
  try {
    const result = await fetch(`${endpoint}?tag=${value}`);
    const { posts } = await result.json();
    return posts;
  } catch (err) {
    throw err;
  }
};

exports.getPing = async (req, res) => {
  res.status(200).json({ message: true });
};

exports.getPosts = async (req, res) => {
  //Get Query Field and Value

  let { tags, sortBy, direction } = req.query;
  if (!tags || tags === "") {
    const error = new Error("Tags parameter is required");
    res.status(400).json({ message: error.message });
    return;
  }
  const tagValues = tags
    .toString()
    .trim()
    .split(",");
  //Fetch posts for each query value
  const finalResults = [];
  try {
    await Promise.all(
      tagValues.map(async value => {
        const result = await fetchPostsWithQuery(value);
        //Filter for existing itmes in array
        const filteredResults = await result.filter(el => {
          const index = finalResults.findIndex(item => item.id === el.id);
          if (index === -1) {
            return el;
          }
        });
        finalResults.push(...filteredResults);
        return;
      })
    );
    //Check if sort query exists

    //set default value to 'id' if empty
    if (sortBy === "" || !sortBy) {
      sortBy = "id";
    }
    const sort = () => {
      return finalResults.sort((curr, next) => {
        return direction === "desc"
          ? next[sortBy] - curr[sortBy]
          : curr[sortBy] - next[sortBy];
      });
    };

    //sort by valid inputs
    switch (sortBy) {
      case "id":
        sort();
        break;
      case "reads":
        sort();
        break;
      case "likes":
        sort();
        break;
      case "popularity":
        sort();
        break;
      default:
        const error = new Error(
          "sortBy parameter is invalid, please sort by id, reads,likes or popularity"
        );
        error.statusCode = 400;
        throw error;
    }

    res.status(200).json({ posts: finalResults });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
