class ContactboosterApp
  toggleMenu: ->
    element(By.id("toggleLeftBtn")).click()
  clickContactNewButton: (cb) ->
    element(By.id("addNewContactBtn")).click().then ->
      cb()
  selectList: (list) ->
    element(By.id("#{list}_list")).click()
  getListFromRepeater: (repeater) ->
    element.all(By.repeater(repeater))
  editInput: (field, value)  ->
    element(By.input(field)).clear()
    element(By.input(field)).sendKeys(value)
  editInputs: (inputs) ->
    for field, value of inputs
      @editInput field, value
  submitEdit: (cb) ->
    element(By.partialButtonText('Edit contact')).click().then ->
      cb()
  submitAdd: (cb) ->
    element(By.buttonText('Add')).click().then ->
      cb()
  clickContactActionButton: (contactItem, cb) ->
    contactItem.findElement(By.css('.button')).click().then ->
      cb()
  clickContactEditButton: (cb) ->
    element(By.partialButtonText('Edit')).click().then ->
      cb()
  clickContactDeleteButton: (cb) ->
    element(By.buttonText('Delete')).click().then ->
      cb()




module.exports = new ContactboosterApp