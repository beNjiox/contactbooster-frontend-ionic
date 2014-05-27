app = require './page_objects/app'

ptor = protractor.getInstance()

describe "adding a client", ->
  it "should open the menu and select a list", ->
    browser.get 'http://localhost:8033/'

    app.toggleMenu()
    app.selectList 'family'
    elems = app.getListFromRepeater "c in activeContacts.contacts"
    expect(elems.count()).toBe 2
