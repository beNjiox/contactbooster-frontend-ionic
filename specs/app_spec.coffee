app = require './page_objects/app'

ptor = protractor.getInstance()

describe "adding a client", ->
  it "should open the menu and select a list", ->
    browser.get 'http://localhost:8033/'

    app.toggleMenu()
    app.selectList 'family'
    elems = app.getListFromRepeater "c in activeContacts.contacts"
    expect(elems.count()).toBe 2

    elems.first().then (elem) ->
      elem.findElement(By.css('.button')).click().then ->
        element(By.partialButtonText('Edit')).click().then ->
          element(By.input('contact.firstname')).clear()
          element(By.input('contact.lastname')).clear()
          element(By.input('contact.phone')).clear()
          element(By.input('contact.firstname')).sendKeys('Benjamin')
          element(By.input('contact.lastname')).sendKeys('Guez')
          element(By.input('contact.phone')).sendKeys('42424242')
          element(By.partialButtonText('Edit contact')).click().then ->
            elems.first().then (elem) ->
              expect(elem.findElement(By.css('.firstname')).getText()).toBe('Benjamin')
              expect(elem.findElement(By.css('.lastname')).getText()).toBe('Guez')
              expect(elem.findElement(By.css('.phone')).getText()).toBe('42424242')

