MochaWeb?.testOnly ->

  assert = chai.assert

  describe 'Apollos', ->
    describe 'person', ->

      beforeEach ->
        Meteor.logout() if Meteor.isClient
        Meteor.flush()

      it 'should be defined', ->
        assert typeof Apollos.person is 'function'
      it 'should return object', ->
        assert typeof Apollos.person() is 'object'

      describe 'when not signed in', ->

        if Meteor.isclient
          it 'should have no keys', ->
            assert.equal Object.keys(Apollos.person()).length, 0

      describe 'when signed in', ->

        if Meteor.isClient
          before (done) ->
            Apollos.user.create 'apollos.person@newspring.cc', 'testPassword'
            Meteor.autorun ->
              user = Apollos.users.findOne('emails.address': 'apollos.person@newspring.cc')
              done() if user

          describe 'when no rock association', ->

            it 'should have no keys', ->
              assert.equal Object.keys(Apollos.person()).length, 0
