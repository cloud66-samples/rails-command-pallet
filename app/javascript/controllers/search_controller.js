import { Controller } from "@hotwired/stimulus"
import lunr from "lunr"

let indexed = false 
async function doIndex() {
  try {
    const response = await fetch(this.urlValue);
    const index = await response.json();
    this.lunrIndex = lunr(function () {
      this.field("title")
      this.field("alternatives")
      index.forEach(doc => this.add(doc))
    })
    this.index = index
  } catch (error) {
    console.log(error)
  } 
  finally {
    console.log("indexing complete")
    indexed = true
  }
}

export default class extends Controller {
  static lunrIndex = null
  static values = { url: String }
  static targets = ["input", "results"]
  static index = null 
  
  connect() {
    console.log("Search controller connected!")
    doIndex.call(this)
  }   

  search(event) {
    if (!indexed) {
      console.log("indexing...")
      return
    }

    let query = this.inputTarget.value;

    // clean the results if the query is empty
    if (query === "") {
      this.resultsTarget.innerHTML = "";
      this.resultsTarget.classList.add("hidden")
      return;
    }

    let results = this.lunrIndex.search(query + "*")

    if (results.length === 0) {
      this.resultsTarget.innerHTML = "";
      this.resultsTarget.classList.add("hidden")
      return;
    }
    
    let html = ""
    let index = this.index
    results.forEach(result => {
      let doc = index[result.ref]
      html += "<li class=\"flex items-center mb-2\">"
      if (doc.type === "command") {
      html += `<i class="fa-regular fa-${doc.icon} w-12 h-12 text-gray-400"></i>`
      } else {
      html += `<img src="${doc.avatar}" class="w-12 h-12 rounded-full border-2 border-grey-400 bg-gray-100"/>`
      }
      html += `<a href="${doc.url}" class="ml-4 text-lg">${doc.title}</a>
      </li>`
    })
    this.resultsTarget.innerHTML = html
    this.resultsTarget.classList.remove("hidden")
  }
}
