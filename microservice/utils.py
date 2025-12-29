def format_response(overall, comparisons):
    return {
        "status": "success",

        # 🔥 convert numpy → python float
        "overall_similarity": float(overall),

        # 🔥 sanitize every comparison
        "comparisons": [
            {
                "file1": c["file1"],
                "file2": c["file2"],
                "similarity": float(c["similarity"])
            }
            for c in comparisons
        ]
    }


#error faces is numpy was not converting to python so was not able to read file
#JSON cannot handle NumPy objects

#another error was frontend showing json result of it