import { useState } from "react";

export default function XssHackChallenge() {
  const [input1, setInput1] = useState("");
  const [output1, setOutput1] = useState("");
  const [imageInput, setImageInput] = useState("");
  const [imageHtml, setImageHtml] = useState("");
  const [progress, setProgress] = useState(0);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [complete, setComplete] = useState({
    level1: false,
    level2: false,
  });

  const updateLevel = (level) => {
    setComplete((prev) => {
      const updated = { ...prev, [level]: true };
      const total = Object.values(updated).filter(Boolean).length;
      setProgress(total);

      if (total === 2 && !challengeCompleted) {
        setChallengeCompleted(true);
        setTimeout(() => {
          alert(
            "🎉 ¡Felicidades! Has completado los 2 retos de XSS. Toma una captura de pantalla y compártela con el equipo."
          );
        }, 300);
      }
      return updated;
    });
  };

  const reset = () => {
    setInput1("");
    setOutput1("");
    setImageInput("");
    setImageHtml("");
    setProgress(0);
    setComplete({ level1: false, level2: false });
    setChallengeCompleted(false);
  };

  const runLevel1 = () => {
    //setOutput1(`Hola ${input1}`);
    if (/<script>|onerror=|alert\(/i.test(input1)) {
      updateLevel("level1");
    }
  };

  const runLevel2 = () => {
    const unsafePatterns = /(onerror=|javascript:|<script>|<|>)/i;
    if (unsafePatterns.test(imageInput)) {
      const img = `<img src="${imageInput}" class="img-fluid" alt="imagen insegura" />`;
      setImageHtml(img);
      updateLevel("level2");
    } else {
      alert("⚠️ La URL esta limpia");

    }

  };

  return (
    <div className="mx-auto" style={{ maxWidth: "720px" }}>
      <h1 className="text-center mb-4">🛡️ XSS Hack Challenge</h1>

      <div className="progress mb-4">
        <div
          className="progress-bar bg-success"
          role="progressbar"
          style={{ width: `${(progress / 2) * 100}%` }}
        >
          {Math.floor((progress / 2) * 100)}%
        </div>
      </div>

      <button className="btn btn-danger mb-4" onClick={reset}>
        🔄 Reiniciar Retos
      </button>

      {/* Ayuda/Pistas */}
      <div className="alert alert-info">
        <h5>🧠 Ayuda / Pistas</h5>
        <ul>
          <li><strong>Reto 1:</strong> Prueba ingresando código malicioso en el input y observa la salida reflejada.</li>
          <li><strong>Reto 2:</strong> Prueba ingresando una URL insegura en el input y observa la salida reflejada.</li>
        </ul>
      </div>

      {/* Reto 1 */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">🔓 Reto 1: XSS Reflejado</h5>
          <input
            className="form-control mb-2"
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
            placeholder="Escribe algo..."
          />
          <button className="btn btn-primary" onClick={runLevel1}>
            Enviar
          </button>
          <p className="mt-3" dangerouslySetInnerHTML={{ __html: output1 }} />
        </div>
      </div>

      {/* Reto 2 */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">🔒 Reto 2: Validación de URL</h5>
          <input
            className="form-control mb-2"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            placeholder="Ingresa una URL de imagen segura..."
          />
          <button className="btn btn-warning" onClick={runLevel2}>
            Verificar Imagen
          </button>
          <div className="mt-3" dangerouslySetInnerHTML={{ __html: imageHtml }} />
        </div>
      </div>
    </div>
  );
}


{/* <script>alert('XSS en chat')</script> */ }
// https://evil.com/image.jpg?onerror=alert(1)
