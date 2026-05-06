//abstraction is a process of hiding the implementation details and showing only functionality to the user.
//abstraction can be achieved by using abstract classes and interfaces in TypeScript.
// 1.interface
//2.abstract class

interface MediaPlayer {
  play(): void;
  pause(): void;
  stop(): void;
}

class AudioPlayer implements MediaPlayer {
  play() {
    console.log("Playing audio...");
  }
  pause() {
    console.log("Pausing audio...");
  }
  stop() {
    console.log("Stopping audio...");
  }
}

class VideoPlayer implements MediaPlayer {
  play() {
    console.log("Playing video...");
  }
  pause() {
    console.log("Pausing video...");
  }
  stop() {
    console.log("Stopping video...");
  }
}

const audioPlayer = new AudioPlayer();
audioPlayer.play(); // Output: Playing audio...
audioPlayer.pause(); // Output: Pausing audio...
audioPlayer.stop(); // Output: Stopping audio...

const videoPlayer = new VideoPlayer();
videoPlayer.play(); // Output: Playing video...
videoPlayer.pause(); // Output: Pausing video...
videoPlayer.stop(); // Output: Stopping video...

// In this example, we have defined an interface `MediaPlayer` that declares three methods: `play`, `pause`, and `stop`. The `AudioPlayer` and `VideoPlayer` classes implement the `MediaPlayer` interface, providing their own implementations of the methods. This allows us to use the same interface to interact with different types of media players, abstracting away the specific details of how each player works.

// abstract class MediaPlayerAbstract {

//   play(): void;
//   pause(): void;
//   stop(): void;

// }
// Function implementation is missing or not immediately following the declaration
// In this example, we have defined an abstract class `MediaPlayerAbstract` that declares three methods: `play`, `pause`, and `stop`. However, since it's an abstract class, it cannot be instantiated directly, and the methods do not have implementations. Instead, we would need to create subclasses that extend the abstract class and provide concrete implementations for the methods.

abstract class MediaPlayerAbstract {
  abstract play(): void;
  abstract pause(): void;
  abstract stop(): void;
}

//from abstract class we can't create intences but we can create instances from the child class which extends the abstract class and provides implementation for the abstract methods.

class AudioPlayerAbstract extends MediaPlayerAbstract {
  play() {
    console.log("Playing audio...");
  }
  pause() {
    console.log("Pausing audio...");
  }
  stop() {
    console.log("Stopping audio...");
  }
}

const audioPlayerAbstract = new AudioPlayerAbstract();
audioPlayerAbstract.play(); // Output: Playing audio...
audioPlayerAbstract.pause(); // Output: Pausing audio...
audioPlayerAbstract.stop(); // Output: Stopping audio...

// In this example, we have created a subclass `AudioPlayerAbstract` that extends the `MediaPlayerAbstract` class and provides concrete implementations for the `play`, `pause`, and `stop` methods. We can then create an instance of `AudioPlayerAbstract` and call the methods to see the output.  