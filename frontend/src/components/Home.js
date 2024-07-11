import React, { useState } from "react";
// import Loading from "react-loading";
import Loading from "react-loading";

const Home = () => {
    const [result, setResult] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // State for loading animation

    const handleSubmit = async (event) => {
        event.preventDefault();
        let formData = new FormData();
        formData.append("file", document.getElementById("file").files[0]);

        try {
            setLoading(true); // Start loading animation

            let response = await fetch("http://localhost:5000/process_pdf", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error);
            }

            let result = await response.json();

            // Convert JSON result to a line-separated string
            let resultString;
            if (Array.isArray(result.text)) {
                resultString = result.text.join("\n");
            } else {
                resultString = result.text;
            }

            setResult(resultString);
            setError(""); // Clear error if successful
        } catch (error) {
            console.error("Error:", error);
            setResult(""); // Clear previous result if error occurs
            setError(`Error: ${error.message}`);
        } finally {
            setLoading(false); // Stop loading animation
        }
    };

    return (
        <div className="flex justify-center">
            <div className="bg-white shadow-md rounded-lg p-8 max-w-fit w-full min-w-[80%] md:min-w-[35rem] mt-6">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Image/PDF to Text Converter
                </h1>
                <form
                    id="uploadForm"
                    className="flex flex-col space-y-4 "
                    onSubmit={handleSubmit}
                    encType="multipart/form-data"
                >
                    <label className="">
                        <span className="sr-only">Choose File</span>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"
                        />
                    </label>
                    <input
                        type="submit"
                        value="Upload"
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 cursor-pointer w-fit"
                    />
                </form>
                {loading && (
                    <div className="flex justify-center mt-4">
                        <Loading type="bars" color="#3182CE" height={50} width={50} />
                    </div>
                )}
                <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md overflow-scroll">
                    {result && <pre>{result}</pre>}
                    {error && <pre className="text-red-500">{error}</pre>}
                </div>
            </div>
        </div>
    );
};

export default Home;
