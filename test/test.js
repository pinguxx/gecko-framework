gk(function(){
    Evidence.TestCase.extend('ArrayTest', {
      setUp: function() {
      },
      
      testGecko: function() {
        this.assert(window.gecko, 'gecko is not alive');
        this.assertEqual('0.0.1', gk().gecko);
        this.assert(gk(), 'gecko is not an object :(');
        this.assertTrue(gk.isReady);
        this.assertFalse(!gk.isReady);
      },
     
      testSelector: function() {
        this.assert(gk('#h3'));
        this.assert(gk('bla'));
        this.refute(gk('bla')[0]);
        this.assertEqual(1, gk('#h2').length);
        this.assertEqual(17, gk('div').length);
        this.assertEqual(3, gk('p').length);
        this.assertEqual(5, gk('.ho1').length);
        this.assertEqual(3, gk('.ho1', gk('#h1')).length);
        this.assertEqual(0, gk('bla').length);
        this.assertEqual(0, gk('bla', gk('#h1')).length);
        this.assertEqual(2, gk('#h1 > #h11 > div').length);
        this.assertEqual(2, gk('div', gk('#h11')).length);
        this.assertEqual(3, gk('#h1 .ho1').length);
      },
      
      testAtribute: function() {
        this.assertEqual('h2', gk('#h2').a('id'));
        this.assertEqual('ho1', gk('#h2').a('class'));
        gk('#h2').a('class', null);
        this.assertEqual('', gk('#h2').a('class'));
        gk('#h2').a('class', 'ho1');
        this.assertEqual('ho1', gk('#h2').a('class'));
        gk('#h3').a('hu', 'hu');
        this.assertEqual('hu', gk('#h3').a('hu'));
        gk('#h3').a('hu', null);
        this.assertEqual(null, gk('#h3').a('hu'));
        //adding object to an attr
        prop = {prop: 1, prop2: 2};
        gk('#h4').a('hu', prop);
        this.assertEqual(prop.prop, gk('#h4').a('hu').prop);
        gk('#h4').a('hu', null);
        this.assertEqual(null, gk('#h4').a('hu'));
      },

      testHtml: function() {
        this.assertEqual('hola2', gk('#h2').h());
        this.assertEqual('hola3', gk('#h3').h());
      },

      testRemove: function() {
        this.assertEqual(1, gk('#h5').length);
        gk('#h5').r();
        this.assertEqual(0, gk('#h5', false).length);
      },
      
      testValue: function() {
        this.assertEqual('a', gk('#h6').v());
      },
      
      testCss: function() {
        this.assertEqual('100px', gk('#h2').c('height'));
        this.assertEqual('200px', gk('#h2').c('width'));
        this.assertEqual('#000000', gk('#h2').c('color'));
        gk('#h2').c('width', '150px');
        this.assertEqual('150px', gk('#h2').c('width'));
      },
      
      testEvent: function(){    
        this.assert(gk('.ho1').e('click', function(){ console.log('hola') }));
        this.assert(gk('.ho1').e('click', null));
      },
      
      testClass: function(){    
        this.assertEqual(true, gk('#h1').C('ho1'));
        this.refute(gk('#h1').C('bla'));
      },
      
      testCookie: function(){        
        this.refute(gk.ce('bla'));
      },  
      testDD: function(){
        var parent = gk('#wrap');
        gk('#dragMe').dd();
        gk('#dragMe').rz();
      },
      testDate: function(){
        //test date
        var date = gk.df.date(new Date(1324252305569),"dd/MM/yyyy");
        var date1 = gk.df.date(new Date(1324252305569),"dd/MMM/yyyy");
        this.assertEqual('18/12/2011',date);
        this.assertEqual('18/Dec/2011',date1);
      }
    });
});