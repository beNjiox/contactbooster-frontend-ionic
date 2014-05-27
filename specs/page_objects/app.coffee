class ContactboosterApp
  toggleMenu: ->
    element(By.id("toggleLeftBtn")).click()
  selectList: (list) ->
    element(By.id("#{list}_list")).click()
  getListFromRepeater: (repeater) ->
    element.all(By.repeater(repeater))

module.exports = new ContactboosterApp