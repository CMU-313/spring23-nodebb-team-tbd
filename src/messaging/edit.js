'use strict'
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt (value) { return value instanceof P ? value : new P(function (resolve) { resolve(value) }) }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) { try { step(generator.next(value)) } catch (e) { reject(e) } }
    function rejected (value) { try { step(generator.throw(value)) } catch (e) { reject(e) } }
    function step (result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected) }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
Object.defineProperty(exports, '__esModule', { value: true })
const meta = require('../meta')
const user = require('../user')
const plugins = require('../plugins')
const privileges = require('../privileges')
const sockets = require('../socket.io')
module.exports = function (Messaging) {
  Messaging.editMessage = (uid, mid, roomId, content) => __awaiter(this, void 0, void 0, function * () {
    yield Messaging.checkContent(content)
    const raw = yield Messaging.getMessageField(mid, 'content')
    if (raw === content) {
      return
    }
    // The next line calls a function in a module that has not been updated to TS yet
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const payload = yield plugins.hooks.fire('filter:messaging.edit', {
      content,
      edited: Date.now()
    })
    if (!String(payload.content).trim()) {
      throw new Error('[[error:invalid-chat-message]]')
    }
    yield Messaging.setMessageFields(mid, payload)
    // Propagate this change to users in the room
    const [uids, messages] = yield Promise.all([
      Messaging.getUidsInRoom(roomId, 0, -1),
      Messaging.getMessagesData([mid], uid, roomId, true)
    ])
    uids.forEach((uid) => {
      // The next line calls a function in a module that has not been updated to TS yet
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      sockets.in(`uid_${uid}`).emit('event:chats.edit', {
        messages
      })
    })
  })
  const canEditDelete = (messageId, uid, type) => __awaiter(this, void 0, void 0, function * () {
    let durationConfig = ''
    if (type === 'edit') {
      durationConfig = 'chatEditDuration'
    } else if (type === 'delete') {
      durationConfig = 'chatDeleteDuration'
    }
    const exists = yield Messaging.messageExists(messageId)
    if (!exists) {
      throw new Error('[[error:invalid-mid]]')
    }
    // The next line calls a function in a module that has not been updated to TS yet
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const isAdminOrGlobalMod = yield user.isAdminOrGlobalMod(uid)
    // The next line calls a function in a module that has not been updated to TS yet
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const disabled = meta.config.disableChat
    if (disabled) {
      throw new Error('[[error:chat-disabled]]')
    } else if (!isAdminOrGlobalMod) {
      // The next line calls a function in a module that has not been updated to TS yet
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const metaval = meta.config.disableChatMessageEditing
      if (metaval) {
        throw new Error('[[error:chat-message-editing-disabled]]')
      }
    }
    // The next line calls a function in a module that has not been updated to TS yet
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const userData = yield user.getUserFields(uid, ['banned'])
    if (userData.banned) {
      throw new Error('[[error:user-banned]]')
    }
    // The next line calls a function in a module that has not been updated to TS yet
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const canChat = yield privileges.global.can('chat', uid)
    if (!canChat) {
      throw new Error('[[error:no-privileges]]')
    }
    const messageData = yield Messaging.getMessageFields(messageId, ['fromuid', 'timestamp', 'system'])
    if (isAdminOrGlobalMod && !messageData.system) {
      return
    }
    // The next line calls a function in a module that has not been updated to TS yet
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const chatConfigDuration = meta.config[durationConfig]
    if (chatConfigDuration && Date.now() - messageData.timestamp > chatConfigDuration * 1000) {
      throw new Error(`[[error:chat-${type}-duration-expired, ${chatConfigDuration}]]`)
    }
    if (messageData.fromuid === parseInt(uid, 10) && !messageData.system) {
      return
    }
    throw new Error(`[[error:cant-${type}-chat-message]]`)
  })
  Messaging.canEdit = (messageId, uid) => __awaiter(this, void 0, void 0, function * () { return yield canEditDelete(messageId, uid, 'edit') })
  Messaging.canDelete = (messageId, uid) => __awaiter(this, void 0, void 0, function * () { return yield canEditDelete(messageId, uid, 'delete') })
}
