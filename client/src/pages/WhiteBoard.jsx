import { Excalidraw, CaptureUpdateAction, Footer } from "@excalidraw/excalidraw";
import { useState, useEffect } from "react";
import "@excalidraw/excalidraw/index.css";
import "../index.css";
import io from "socket.io-client";
const socket = io("http://localhost:3000");

function debounce(func, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

export default function WhiteBoard() {

  const [excalidrawAPI, setExcalidrawAPI] = useState(null);

  // Client-side events
  socket.on("connect", () => {
    console.log("Connected to server with ID:", socket.id);
  });

  socket.on("chat", (msg) => {
    console.log("Received message:", msg);
  });

  socket.on("connect_error", (error) => {
    console.log("Connection failed:", error.message);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });

  const debouncedHandleChange = debounce((elements, appState, files) => {
    socket.emit("scene-update", { elements });
  }, 200); // Small delay for performance

  useEffect(() => {
    if (!socket) return;

    socket.on("scene-update", ({ elements: incomingElements }) => {
      if (!excalidrawAPI) return;

      const currentElements = excalidrawAPI.getSceneElements();

      const mergedMap = new Map();

      for (const el of [...currentElements, ...incomingElements]) {
        const existing = mergedMap.get(el.id);
        if (!existing || el.version > existing.version) {
          mergedMap.set(el.id, el);
        }
      }

      const mergedElements = Array.from(mergedMap.values());
      excalidrawAPI.updateScene({ elements: mergedElements });
    });


    return () => {
      socket.off("scene-update");
    };
  }, [excalidrawAPI]);

  // Show collaborators when excalidrawAPI is ready
  useEffect(() => {
    if (excalidrawAPI) {
      console.log("Setting up collaborators...");
      
      // Small delay to ensure API is fully ready
      setTimeout(() => {
        const collaborators = new Map();
        collaborators.set("id1", {
          username: "Doremon",
          avatarUrl: "/Doreamon (1).png",
        });
        collaborators.set("id3", {
          username: "Puka", 
          avatarUrl: "/Nobita (3).png",
        });
        console.log("Collaborators map:", collaborators);
        excalidrawAPI.updateScene({ collaborators });
        console.log("Collaborators updated!");
      }, 100);
    }
  }, [excalidrawAPI]);



  //? This is for saving the elements in database
  // const handleChange = async (elements, appState, files) => {

  //   const response = await fetch("http://localhost:3000/save", {
  //     // Adding method type
  //     method: "POST",
      
  //     // Adding body or contents to send
  //     body: JSON.stringify({
  //         [elements]: elements
  //     }),
      
  //     // Adding headers to the request
  //     headers: {
  //         "Content-type": "application/json; charset=UTF-8"
  //     }
  //   });

  //   const data = response.json();

  // }

  const updateScene = () => {
    if (!excalidrawAPI) {
      console.warn("Excalidraw API not ready yet");
      return;
    }

    const sceneData = {
      elements: [
        {
          x: 322.3999938964844,
          y: 182.80003356933594,
          id: "kGjHtpd05g9p-2M1OLLhM",
          link: null,
          seed: 293869760,
          type: "freedraw",
          angle: 0,
          index: "a0",
          width: 14.399993896484375,
          height: 212.7999725341797,
          locked: false,
          points: [
            [0, 0],
            [-4.79998779296875, 12],
            [-7.199981689453125, 19.199966430664062],
            [-9.5999755859375, 28.799972534179688],
            [-12.79998779296875, 40.79997253417969],
            [-12.79998779296875, 50.39996337890625],
            [-12.79998779296875, 63.19996643066406],
            [-12.79998779296875, 76.79997253417969],
            [-12.79998779296875, 91.19996643066406],
            [-12.79998779296875, 105.59996032714844],
            [-12.79998779296875, 119.99998474121094],
            [-11.199981689453125, 135.19996643066406],
            [-8, 150.3999786376953],
            [-7.199981689453125, 162.3999786376953],
            [-5.5999755859375, 171.99998474121094],
            [-2.399993896484375, 181.59996032714844],
            [-1.5999755859375, 187.19996643066406],
            [0, 194.3999786376953],
            [0, 199.19996643066406],
            [1.600006103515625, 202.3999786376953],
            [1.600006103515625, 207.19996643066406],
            [1.600006103515625, 209.59996032714844],
            [1.600006103515625, 211.19996643066406],
            [1.600006103515625, 212.7999725341797],
            [1.600006103515625, 212.7999725341797],
          ],
          frameId: null,
          opacity: 100,
          updated: 1749053035961,
          version: 26,
          groupIds: [],
          fillStyle: "solid",
          isDeleted: false,
          pressures: [],
          roughness: 1,
          roundness: null,
          strokeColor: "#1e1e1e",
          strokeStyle: "solid",
          strokeWidth: 2,
          versionNonce: 1826611392,
          boundElements: null,
          backgroundColor: "transparent",
          simulatePressure: true,
          lastCommittedPoint: [1.600006103515625, 212.7999725341797],
        },
      ],
      appState: {
        viewBackgroundColor: "#edf2ff",
      },
      captureUpdate: CaptureUpdateAction.IMMEDIATELY,
    };
    excalidrawAPI.updateScene(sceneData);
  };

  return (
    <div style={{ height: "39rem", width: "74rem" }}>
      <Excalidraw
      onChange={debouncedHandleChange}
        theme="dark"
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
      >
        <Footer>
          <div style={{
            border: "1px solid var(--color-primary)", 
            borderRadius: "var(--space-factor)", 
            marginLeft: "0.4rem", 
            backgroundColor: "var(--island-bg-color)",
            position: "absolute"
          }}>
            <div style={{
              color: "var(--color-primary)",
              paddingTop: "0.5rem", 
              paddingBottom: "0.5rem", 
              paddingLeft: "0.75rem",
              paddingRight: "0.75rem",
              fontSize: "13px",
              fontWeight: "500"
            }}>
              Collaborators Active
            </div>
          </div>
        </Footer>  
      </Excalidraw>
    </div>
  );
}

//? Launching App with some inital data
// export default function App() {
//   return (
//     <div style={{ height: "100vh", width: "100vw" }}>
//       <Excalidraw
//         initialData={{
//           elements: [
//             {
//               type: "rectangle",
//               version: 141,
//               versionNonce: 361174001,
//               isDeleted: false,
//               id: "oDVXy8D6rom3H1-LLH2-f",
//               fillStyle: "hachure",
//               strokeWidth: 1,
//               strokeStyle: "solid",
//               roughness: 1,
//               opacity: 100,
//               angle: 0,
//               x: 100.50390625,
//               y: 93.67578125,
//               strokeColor: "#000000",
//               backgroundColor: "transparent",
//               width: 186.47265625,
//               height: 141.9765625,
//               seed: 1968410350,
//               groupIds: [],
//             },
//           ],
//           appState: { zenModeEnabled: true, viewBackgroundColor: "#a5d8ff" },
//           scrollToContent: true
//         }}
//       />
//     </div>
//   );
// }
