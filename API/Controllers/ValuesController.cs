using System;
using System.Data.Sql;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Web.Http;
using System.Net.Http;
using System.Net;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using WeatherAPI.Models;

namespace WeatherAPI.Controllers
{    
    [Route("api/[controller]")]
    [ApiController]
    public class CitiesController : ControllerBase
    {
        // GET api/values
        [HttpGet]        
        public ActionResult<string[]> Get([FromQuery] double latitude,[FromQuery] double longitude)
        {
            if (latitude == 0 && longitude == 0)
                return City.GetCities();
            else
                return new string[] {City.GetCities(latitude, longitude)};
        }

        // GET api/values/5
         [HttpGet("{citydata}")]
         public ActionResult<string> GetByLatLong(string citydata)
         {             
             if (long.TryParse(citydata, out long id))
             {
                return City.GetCityByID(id);
             }
             else if (citydata.Split(',').Length==2)
             {
                string cityname = citydata.Split(',')[0];
                string country = citydata.Split(',')[1];
                return City.GetCityByNameAndCountry(cityname,country);
             }
             else
             {
                 return City.GetCityByName(citydata);
             }
             
         }
        
        [HttpGet("{id}/current")]
        public ActionResult<string> GetCurrentWeather(int id)
        {
            City c = new City();
            c.id = id;
            return c.GetCurrentWeather();
        }

        [HttpGet("{id}/forecast")]
        public ActionResult<string> GetForecast(int id)
        {
            City c = new City();
            c.id = id;
            return c.GetCurrentForecast();
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }    
}


namespace WeatherAPI.Models
{
    public class City
    {
        public int id;
        public string name;
        public string country;
        public double lat;
        public double lon;

        private static List<string> ExecuteCommand(string cmd)
        {
            SqlConnectionStringBuilder b = new SqlConnectionStringBuilder();
            b.ApplicationName = "WeatherApp";
            b.DataSource = @"DESKTOP-R0R5B8H\SqlExpress";
            b.IntegratedSecurity = true;
            b.InitialCatalog = "Weather";
            List<string> results = new List<string>();
            using (SqlConnection con = new SqlConnection(b.ToString()))
            {
                var command = con.CreateCommand();
                command.CommandText = cmd;
                Console.WriteLine(command.CommandText);
                con.Open();
                using (SqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        results.Add((string)reader[0]);
                    }                           
                }           
                con.Close();
                return results;     
            }            
        }
        public static string[] GetCities()
        {
            return ExecuteCommand("Select [name] +', '+ [country] from CityData").ToArray();
        }

        public static string GetCities(double latitude, double longitude)
        {          
            List<string> list = ExecuteCommand(string.Format("Select * from CityData where  ABS(lat - {0}) < .5 and ABS(lon - {1}) < .5 order by (ABS(lat - {0}) + ABS(lon - {1})) for JSON PATH", latitude, longitude));
            string returnstring = "";
            foreach (string s in list)
            {
                returnstring += s;
            }
            return returnstring;
        }

        public static string GetCityByNameAndCountry(string cityname, string country)
        {
            List<string> list = ExecuteCommand(string.Format("Select * from CityData where name = '{0}' and country = '{1}' for JSON PATH", cityname, country));
            string returnstring = "";
            foreach (string s in list)
            {
                returnstring += s;
            }
            return returnstring;
        }

        public static string GetCityByName(string cityname)
        {            
            List<string> list = ExecuteCommand(string.Format("Select top 1 * from CityData where name = '{0}' order by country desc for JSON PATH", cityname));
            string returnstring = "";
            foreach (string s in list)
            {
                returnstring += s;
            }
            return returnstring;
        }

        public static string GetCityByID(long id)
        {
            List<string> list = ExecuteCommand(string.Format("Select * from CityData where id = '{0}' for JSON PATH", id));
            string returnstring = "";
            foreach (string s in list)
            {
                returnstring += s;
            }
            return returnstring;
        }

        private string CallOpenWeatherAPI(string path)
        {
            string resp = string.Empty;
                string url = string.Format(@"https://api.openweathermap.org/data/2.5/{0}?id={1}&appid=75fe21aa692702e9054964d0c336bad7&units=imperial",path,id);

                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);                

                using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
                {
                    using (Stream stream = response.GetResponseStream())
                    {
                        using (StreamReader reader = new StreamReader(stream))
                        {
                            resp = reader.ReadToEnd();
                        }
                    }
                }
                return resp.Replace(@"\","");      
        }        
        
        public string GetCurrentWeather()
        {
            //Only get data if it's from 10 minutes or less
            List<string> list = ExecuteCommand(string.Format("Select CurrentData from CurrentWeather where cityid = '{0}' and updated > DATEADD(minute,-10,getdate())", id));
            string returnstring = "";
            foreach (string s in list)
            {
                returnstring += s;
            }
            if (string.IsNullOrEmpty(returnstring))
            {
                returnstring = CallOpenWeatherAPI("weather");                
                ExecuteCommand(string.Format("Delete from CurrentWeather where cityid = {0}", id));
                ExecuteCommand(string.Format("Insert into CurrentWeather values({0},'{1}',GETDATE())", id,returnstring));                                   
            }
            return returnstring.Replace(@"\","");
        }

        public string GetCurrentForecast()
        {
            //Only get data if it's from 10 minutes or less
            List<string> list = ExecuteCommand(string.Format("Select forecastdata from Forecast where cityid = '{0}' and updated > DATEADD(minute,-10,getdate())", id));
            string returnstring = "";
            foreach (string s in list)
            {
                returnstring += s;
            }
            if (string.IsNullOrEmpty(returnstring))
            {
                returnstring = CallOpenWeatherAPI("forecast");
                ExecuteCommand(string.Format("Delete from Forecast where cityid = {0}", id));
                ExecuteCommand(string.Format("Insert into Forecast values({0},'{1}',GETDATE())", id,returnstring));                                   
            }
            return returnstring.Replace(@"\","");
        }
    }
}
