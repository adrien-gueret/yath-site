class Pagination {
    constructor(startIndexElement, elementsByPage, totalElements, request) {
      this.currentPage = Math.floor(startIndexElement / elementsByPage) + 1;
      this.totalElements = totalElements;
      this.setElementsByPage(elementsByPage);
      this.request = request;
    }

    setElementsByPage(elementsByPage) {
        this.elementsByPage = elementsByPage;
        this.totalPages = Math.ceil(this.totalElements / elementsByPage);
    }
  
    previous() {
      return this.getPage(this.currentPage - 1);
    }
  
    next() {
      return this.getPage(this.currentPage + 1);
    }

    getPage(pageNumber) {
      if (pageNumber < 1 || pageNumber > this.totalPages) {
        throw new RangeError(`Pagination::getPage: try to get page ${pageNumber} while minimum is 1 and maximum is ${this.totalPages}.`);
      }
  
      const start = this.elementsByPage * (pageNumber - 1);
      const end = (start + this.elementsByPage) - 1;
  
      return this.request.paginate(start, end).execute().then((data) => {
        this.currentPage = +pageNumber;
  
        return data;
      });
    }

    isOnLastPage() {
      return this.currentPage === this.totalPages;
    }

    isOnFirstPage() {
      return this.currentPage === 1;
    }
  
    serialize() {
      const {
        currentPage, elementsByPage, totalElements, totalPages,
      } = this;
  
      return {
        currentPage, elementsByPage, totalElements, totalPages,
      };
    }
  }
  
  export default Pagination;