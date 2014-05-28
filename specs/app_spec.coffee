app = require './page_objects/app'

expect_row_information = (rowItem, contactInfo) ->
  for field, value of contactInfo
    expect(elem.findElement(By.css(".#{field}")).getText()).toBe(value)

describe "adding a client", ->
  elems = []

  beforeEach ->
    browser.get 'http://localhost:8033/'
    app.toggleMenu()
    app.selectList 'family'
    elems = app.getListFromRepeater "c in activeContacts.contacts"

  it "should contain rows", ->
    expect(elems.count()).toBe 2

  it "Edit a contact successfully", ->
    elems.first().then (elem) ->
      app.clickContactActionButton elem, ->
        app.clickContactEditButton ->
          app.editInputs( {'contact.firstname': 'Benjamin', 'contact.lastname':'Guez', 'contact.phone': '42424242'} )
          app.submitEdit ->
            elems.first().then (elem) ->
              expect_row_information({'firstname': 'Benjamin', 'lastname':'Guez', 'phone': '42424242'})

  it "Add a contact successfully", ->
    app.clickContactNewButton ->
      app.editInputs( {'contact.firstname': 'Michel', 'contact.lastname':'Sapin', 'contact.phone': '88888888'} )
      app.submitAdd ->
        elems.last().then (elem) ->
          expect_row_information({'firstname': 'Michel', 'lastname':'Sapin', 'phone': '88888888'})
          expect(elems.count()).toBe 3

  it "Delete a contact successfully", ->
    elems.first().then (elem) ->
      app.clickContactActionButton elem, ->
        app.clickContactDeleteButton ->
          alertDialog = browser.switchTo().alert();
          alertDialog.accept().then ->
            expect(elems.count()).toBe 1





