<template>
  <div class="speech flex flex-col items-start gap-2">
    <button
      @click="toggleRecognition"
      :class="[
        'h-10 px-6 rounded shadow transition font-medium',
        isListening
          ? 'bg-red-600 text-white animate-pulse'
          : 'bg-[var(--color-element)] text-[var(--color-text-alt)] hover:opacity-80'
      ]"
    >
      {{ isListening ? "⏹ Stop" : "🎤 Speak" }}
    </button>

    <!-- Transcript feedback -->
    <p v-if="transcript" class="text-sm text-[var(--color-text-alt)] italic">
      {{ transcript }}
    </p>
  </div>
</template>

<script>
export default {
  name: "Speech",
  data() {
    return {
      recognition: null,
      isListening: false,
      transcript: "",
    };
  },
  methods: {
    initRecognition() {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Web Speech API not supported in this browser.");
        return;
      }
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true; // show partial results
      this.recognition.lang = "en-US";

      this.recognition.onresult = (event) => {
        let text = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        this.transcript = text.trim();

        if (event.results[event.results.length - 1].isFinal) {
          this.$emit("transcriptUpdate", this.transcript);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    },
    toggleRecognition() {
      if (!this.recognition) this.initRecognition();

      if (this.isListening) {
        this.recognition.stop();
        this.isListening = false;
      } else {
        this.transcript = "";
        this.recognition.start();
        this.isListening = true;
      }
    }
  }
};
</script>

<style scoped>
button.animate-pulse {
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.9);
}
</style>
