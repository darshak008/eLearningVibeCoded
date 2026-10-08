const APIFeatures = (query, queryString) => {
  const filter = { ...queryString };
  const excludedFields = ['page', 'sort', 'limit', 'fields', 'search'];
  excludedFields.forEach((el) => delete filter[el]);

  let queryStr = JSON.stringify(filter);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

  let q = query.find(JSON.parse(queryStr));

  if (queryString.search) {
    const searchRegex = new RegExp(queryString.search, 'i');
    q = q.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { name: searchRegex },
      ],
    });
  }

  if (queryString.sort) {
    const sortBy = queryString.sort.split(',').join(' ');
    q = q.sort(sortBy);
  } else {
    q = q.sort('-createdAt');
  }

  if (queryString.fields) {
    const fields = queryString.fields.split(',').join(' ');
    q = q.select(fields);
  }

  const page = parseInt(queryString.page) || 1;
  const limit = parseInt(queryString.limit) || 10;
  const skip = (page - 1) * limit;
  q = q.skip(skip).limit(limit);

  return q;
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateCertificateId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'CERT-';
  for (let i = 0; i < 16; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

module.exports = { APIFeatures, generateOTP, generateCertificateId };
