import { useEffect, useState } from "react";

export default function XssHackChallenge() {
  const [input1, setInput1] = useState("");
  const [output1, setOutput1] = useState("");
  const [output2, setOutput2] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);
  const [progress, setProgress] = useState(0);

  const [setComplete] = useState({
    level1: false,
    level2: false,
    level3: false,
  });

  useEffect(() => {
    const msg = new URLSearchParams(location.search).get("msg") || "";
    setOutput2(msg);
    if (/<script>|onerror=|alert\(/i.test(msg)) {
      updateLevel("level2");
    }
  }, []);

  const updateLevel = (level) => {
    setComplete((prev) => {
      const updated = { ...prev, [level]: true };
      const total = Object.values(updated).filter(Boolean).length;
      setProgress(total);
      if (total === 3) {
        setTimeout(() => {
          alert(
            "🎉 ¡Felicidades! Has completado los 3 retos de XSS. Toma una captura de pantalla y compártela con el equipo."
          );
        }, 300);
      }
      return updated;
    });
  };

  const reset = () => {
    setInput1("");
    setOutput1("");
    setOutput2("");
    setCommentInput("");
    setComments([]);
    setProgress(0);
    setComplete({ level1: false, level2: false, level3: false });
  };

  const runLevel1 = () => {
    setOutput1(`Hola ${input1}`);
    if (/<script>|onerror=|alert\(/i.test(input1)) {
      updateLevel("level1");
    }
  };

  const postComment = () => {
    setComments((prev) => [...prev, commentInput]);
    if (/<script>|onerror=|alert\(/i.test(commentInput)) {
      updateLevel("level3");
    }
    setCommentInput("");
  };

  return (
    <div className="mx-auto" style={{ maxWidth: "720px" }}>
      <h1 className="text-center mb-4">🛡️ XSS Hack Challenge</h1>

      <div className="progress mb-4">
        <div
          className="progress-bar bg-success"
          role="progressbar"
          style={{ width: `${(progress / 3) * 100}%` }}
        >
          {Math.floor((progress / 3) * 100)}%
        </div>
      </div>

      <button className="btn btn-danger mb-4" onClick={reset}>
        🔄 Reiniciar Retos
      </button>

      {/* Reto 1 */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">🔓 Reto 1: XSS Reflejado (Fácil)</h5>
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
          <h5 className="card-title">🔓 Reto 2: XSS basado en DOM (Medio)</h5>
          <p>
            El valor del parámetro <code>?msg=</code> en la URL se mostrará aquí:
          </p>
          <p className="mt-2" dangerouslySetInnerHTML={{ __html: output2 }} />
        </div>
      </div>

      {/* Reto 3 */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">🔓 Reto 3: XSS Persistente Simulado (Difícil)</h5>
          <input
            className="form-control mb-2"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Escribe tu comentario..."
          />
          <button className="btn btn-secondary" onClick={postComment}>
            Publicar
          </button>
          <div className="mt-3">
            {comments.map((c, i) => (
              <p key={i} className="alert alert-light" dangerouslySetInnerHTML={{ __html: c }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
