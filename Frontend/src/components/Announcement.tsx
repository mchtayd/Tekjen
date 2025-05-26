import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import photo1 from '../img/photo1.jpg';
import photo2 from '../img/photo2.jpg';
import photo3 from '../img/photo3.jpg';
import photo5 from '../img/photo5.jpg';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

export const Announcement = () => {
  const date:Date = new Date();
  return (
    <div>
            <Typography gutterBottom variant="h4" component="div" className='mainHeader' sx={{cursor:'default', marginTop:'1rem', marginBottom:'2rem'}}>
                  GENEL DUYURULAR
            </Typography>
            <Box sx={{ width: '100%' }}>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 3, md: 4 }} sx={{margin: '0px 1rem', display:'flex',justifyContent:'center',alignItems:'center'}}>
                <Grid size={{ xs: 12, md: 3 }}>
                <Card sx={{ maxWidth: 345, minHeight:550}}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="300"
                  image={photo1}
                />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Derecik Bölgesi Yıldırım Riski
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Derecik Bölgesinde son 24 saat içerisinde 120 adet yıldırım düştüğü gözlemlenmiştir. Genel sistemlerimizde sorunlar yaşanmaması için Üs Bölgelerinde Yıldırım Önlemlerin alınması uygun olacaktır. Hava şartları düzelene kadar bu önlemler devam ettirilecektir.
                  <p style={{textAlign:'right', marginTop:'6px', fontSize:'11px'}}>{date.toLocaleString()}</p>
                </Typography>
              </CardContent>
              </CardActionArea>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
              <Card sx={{ maxWidth: 345, minHeight:550 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="300"
                  image={photo2}
                />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Güzeldere Geçidinde Trafik Kazası
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  32 Virajlar mevkiinde yola tır devrilmesi sonucu trafik kazası gerçekleşmiştir. Yol tek şerit halinde ilerlemekte olup kısmi olarak açıktır. Van il sınırına kadar trafik devam etmektedir. Bu güzergahı kullanacak arkadaşların dikkatli olması önemle rica olunur. 
                  <p style={{textAlign:'right', marginTop:'6px', fontSize:'11px'}}>{date.toLocaleString()}</p>
                </Typography>
              </CardContent>
              </CardActionArea>
                </Card>
               </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
              <Card sx={{ maxWidth: 345, minHeight:550 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="300"
                  image={photo3}
                />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  Dağlıca Sektörü Yolda Buzlanma
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Yoğun bir şekilde süren kar yağışı sonrası Yüksekova Dağlıca yolu güzergahında buzlanma vardır. Bu güzergahı kullanacak olan arkadaşların dikkatli olması ve Üs Bölgesine çıkış ve inişlerde zincir kullanması önemle rica olunur.
                  <p style={{textAlign:'right', marginTop:'6px', fontSize:'11px'}}>{date.toLocaleString()}</p>
                </Typography>
              </CardContent>
              </CardActionArea>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
              <Card sx={{ maxWidth: 345, minHeight:550 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="300"
                  image={photo5}
                />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  İbn-i Dayvan Üs Bölgesi Yolu Kapandı
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Son zamanlarda gerçekleşen yoğun yağışlar sonrası İbn-i Dayvan Üs Bölgesi yolu kullanıma kapanmıştır. Yol kullanıma açılana kadar üs gölgesine gerçekleşecek olan tüm bakım onarım faaliyetleri durdurulmuştur. Acil durumlarda helikopter faaliyeti gerçekleşecektir.
                  <p style={{textAlign:'right', marginTop:'6px', fontSize:'11px'}}>{date.toLocaleString()}</p>
                </Typography>
              </CardContent>
              </CardActionArea>
                </Card>
              </Grid>
              </Grid>
            </Box>
        </div>
  )
}
