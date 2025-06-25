// app.js (Main application logic)
const pool = require('../db');
const { AutoTokenizer, AutoModelForCausalLM } = require('@xenova/transformers');

let tokenizer;
let model;

async function loadModel() {
    tokenizer = await AutoTokenizer.from_pretrained('meta-llama/Meta-Llama-3-8B-Instruct');
    model = await AutoModelForCausalLM.from_pretrained('meta-llama/Meta-Llama-3-8B-Instruct');
}

async function analyzeLocationLlama(latitude, longitude, demandScore, deliveryTimeEstimate, serviceCoverage, zone, trafficDensity, populationDensity) {
    const prompt = Analyze the following potential dark store location in Pune: ...;
    const inputs = tokenizer(prompt);
    const outputs = await model.generate(inputs, { max_length: 500 });
    const analysis = tokenizer.decode(outputs[0], { skip_special_tokens: true }).substring(prompt.length).trim();
    return analysis;
}

async function processLocations() {
    let connection;
    try {
        connection = await pool.getConnection();
        const [locations] = await connection.query("SELECT latitude, longitude, demand_score, delivery_time_estimate, service_coverage, zone, traffic_density, population_density FROM potential_stores");

        for (const location of locations) {
            const { latitude, longitude, demand_score, delivery_time_estimate, service_coverage, zone, traffic_density, population_density } = location;
            const analysis = await analyzeLocationLlama(latitude, longitude, demand_score, delivery_time_estimate, service_coverage, zone, traffic_density, population_density);
            console.log(Location: ${latitude}, ${longitude}\nAnalysis: ${analysis}\n);
            await connection.query("UPDATE potential_stores SET analysis = ? WHERE latitude = ? AND longitude = ?", [analysis, latitude, longitude]);
        }
    } catch (error) {
        console.error("Error processing locations:", error);
    } finally {
        if (connection) connection.release();
    }
}

async function main() {
    try {
        await loadModel();
        await processLocations();
        console.log("Analysis completed.");
    } catch (error) {
        console.error("An error occurred:", error);
    } finally {
        pool.end(); // Close the connection pool when done
    }
}

main();