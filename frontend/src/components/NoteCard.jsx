import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const NoteCard = ({
  title,
  description,
  _id,
  isPinned,
  handleDelete,
  updateNote,
}) => {
  const isUserPremium = useSelector((store) => store.user.isPremium);

  return (
    <div
      className="bg-gradient-to-br from-slate-800 to-slate-900 
      border border-slate-700 rounded-xl p-5 shadow-lg hover:shadow-xl 
      hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
    >
      {/* NOTE CONTENT */}
      <Link to={`/note/${_id}`}>
        <div>
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-semibold text-white">{title}</h2>

            {isPinned && <span>📌</span>}
          </div>

          <p className="text-slate-400 mt-2 text-sm break-words line-clamp-3">
            {description}
          </p>
        </div>
      </Link>

      {/* ACTION BUTTONS */}
      <div className="flex gap-2 mt-6 flex-wrap">
        <Link
          to={`/edit/${_id}`}
          className="px-3 py-1 text-sm rounded-md bg-blue-500 hover:bg-blue-600 text-white transition"
        >
          Edit
        </Link>

        <button
          onClick={() => handleDelete(_id)}
          className="px-3 py-1 text-sm rounded-md bg-red-500 hover:bg-red-600 text-white transition"
        >
          Delete
        </button>

        <button
          onClick={() => updateNote(_id, "pin")}
          className="px-3 py-1 text-sm rounded-md bg-slate-700 hover:bg-slate-600 text-white transition"
        >
          📌
        </button>

        <button
          onClick={() => updateNote(_id, "archive")}
          // disabled={!isUserPremium}
          className={`px-3 py-1 text-sm rounded-md transition
    ${
      isUserPremium
        ? "bg-slate-700 hover:bg-slate-600 text-white"
        // : "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-slate-700 hover:bg-slate-600 text-white"
    }`}
        >
          📦
        </button>

        {/* <span className="ml-2 text-xs text-amber-600 font-medium">
          Premium Feature
        </span> */}
      </div>
    </div>
  );
};

export default NoteCard;
