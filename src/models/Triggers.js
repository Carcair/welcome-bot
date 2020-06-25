class Triggers {
  constructor(message, trigger_word, channel, active) {
    this.message = message;
    this.trigger_word = trigger_word;
    this.channel = channel;
    this.active = active;
  }

  /**
   * Checking regular exp, blocking input with unauthorized input
   */
  checkInsert() {
    // Check message title
    if (this.message.length < 5 || this.message.length > 30) return false;
    if (! /^[a-zA-Z0-9]+$/.test(this.message)) return false;

    // Check trigger word
    if (this.trigger_word.length < 5 || this.trigger_word.length > 20) return false;
    if (! /^[a-zA-Z0-9]+$/.test(this.trigger_word)) return false;

    // Check channel name
    if (this.channel.length < 5 || this.channel.length > 20) return false;
    if (! /^[a-zA-Z0-9-_\/]+$/.test(this.channel)) return false;

    // Check active variable
    if (this.active !== 'true' && this.active !== 'false') return false;

    return true;
  }

  /**
   * Encode input before sending query
   */
  encodeInsert() {
    const self = this;
    let temp = {
      message: encodeURIComponent(self.message),
      trigger_word: encodeURIComponent(self.trigger_word),
      channel: encodeURIComponent(self.channel),
      active: encodeURIComponent(self.active)
    };
    return temp;
  }

  /**
   * Decode output from MySQL before sending it to front-end
   */
  decodeOutput() {
    let self = this;
    let temp = {
      message: decodeURIComponent(self.message),
      trigger_word: decodeURIComponent(self.trigger_word),
      channel: decodeURIComponent(self.channel),
      active: decodeURIComponent(self.active)
    };
    return temp;
  }
}

module.exports = Triggers;