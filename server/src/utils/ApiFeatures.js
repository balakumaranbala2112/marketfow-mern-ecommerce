class ApiFeatures {
  constructor(model, queryString) {
    this.model = model;
    this.queryString = queryString;

    this.filter = {};
    this.sortObject = { createdAt: -1 };
    this.populateOptions = [];
    this.useLean = false;

    this.pagination = {
      page: 1,
      limit: 10,
      skip: 0,
    };

    this.meta = {
      filters: {},
      pagination: {},
    };
  }

  search(fields) {
    const search = this.queryString.search;

    if (typeof search === "string" && search.trim() !== "") {
      const searchText = search.trim();

      this.filter.$or = fields.map((field) => ({
        [field]: {
          $regex: searchText,
          $options: "i",
        },
      }));

      this.meta.filters.search = searchText;
    } else {
      this.meta.filters.search = null;
    }

    return this;
  }

  filterExact(field) {
    const value = this.queryString[field];

    if (value !== undefined) {
      this.filter[field] = value;
      this.meta.filters[field] = value;
    } else {
      this.meta.filters[field] = null;
    }

    return this;
  }

  filterBoolean(field) {
    const value = this.queryString[field];

    if (value === "true") {
      this.filter[field] = true;
      this.meta.filters[field] = true;
    } else if (value === "false") {
      this.filter[field] = false;
      this.meta.filters[field] = false;
    } else {
      this.meta.filters[field] = null;
    }

    return this;
  }

  filterNumberRange(field, minKey, maxKey) {
    const minValue = this.queryString[minKey];
    const maxValue = this.queryString[maxKey];

    if (minValue !== undefined || maxValue !== undefined) {
      this.filter[field] = {};

      if (minValue !== undefined) {
        this.filter[field].$gte = Number(minValue);
      }

      if (maxValue !== undefined) {
        this.filter[field].$lte = Number(maxValue);
      }

      this.meta.filters[minKey] =
        minValue !== undefined ? Number(minValue) : null;

      this.meta.filters[maxKey] =
        maxValue !== undefined ? Number(maxValue) : null;
    } else {
      this.meta.filters[minKey] = null;
      this.meta.filters[maxKey] = null;
    }

    return this;
  }

  sort(allowedSortFields, defaultSort = "createdAt") {
    const requestedSort = this.queryString.sort;
    const requestedOrder = this.queryString.order;

    const sortField = allowedSortFields.includes(requestedSort)
      ? requestedSort
      : defaultSort;

    const sortOrder = requestedOrder === "asc" ? 1 : -1;

    this.sortObject = {
      [sortField]: sortOrder,
    };

    this.meta.filters.sort = sortField;
    this.meta.filters.order = sortOrder === 1 ? "asc" : "desc";

    return this;
  }

  paginate(defaultLimit = 10, maxLimit = 50) {
    const page = Math.max(Number(this.queryString.page) || 1, 1);

    const limit = Math.min(
      Math.max(Number(this.queryString.limit) || defaultLimit, 1),
      maxLimit,
    );

    const skip = (page - 1) * limit;

    this.pagination = {
      page,
      limit,
      skip,
    };

    return this;
  }

  populate(path, select = null) {
    this.populateOptions.push({
      path,
      select,
    });

    return this;
  }

  lean() {
    this.useLean = true;
    return this;
  }

  async count() {
    return this.model.countDocuments(this.filter);
  }

  async execute() {
    let query = this.model.find(this.filter);

    this.populateOptions.forEach((option) => {
      query = query.populate(option);
    });

    query = query
      .sort(this.sortObject)
      .skip(this.pagination.skip)
      .limit(this.pagination.limit);

    if (this.useLean) {
      query = query.lean();
    }

    return query;
  }

  getFiltersMeta() {
    return this.meta.filters;
  }

  getPaginationMeta(totalDocuments, totalLabel = "totalDocuments") {
    const totalPages = Math.ceil(totalDocuments / this.pagination.limit);

    return {
      page: this.pagination.page,
      limit: this.pagination.limit,
      [totalLabel]: totalDocuments,
      totalPages,
      hasNextPage: this.pagination.page < totalPages,
      hasPreviousPage: this.pagination.page > 1,
    };
  }
}

export default ApiFeatures;
