    # Egen statistikk; Na er akkumulert fangst per uke.
    Na = cumsum(array([0,25,17,12,5,5,9,3,3,4,2,1,0,5,1,0,0.5,0.5,0.5,0.5])) # åttern er egentlig en toer hvis man tar bort nymfene
    #Na = Na[:int(len(Na)/2)]  # kun halve datamengden
    # fra forsker på byggebolig.no
    #Na = 100*cumsum(array([0, 0.11, 0.075, 0.028, 0.035, 0.035, 0.015, 0.022, 0.022, 0.022, 0.01, 0.003, 0, 0.005, 0.005, 0.005, 0.005, 0.005, 0.002, 0.001, 0.001, 0, 0.004, 0.0005]))


    #arange(len(Na))
    #Na = Na[11:]
    Na = Na - Na[0]
    t = arange(len(Na))
    def err(x, Na=Na, t=t):
        a = x[0]
        N0 = x[1]
        return sum((Na - N0*(1-exp(-a*t)))**2)
    
    a, N0 = minimize(err, [1, 2*max(Na)]).x
    # gir omtrent a = 0.03
    figure()
    plot(Na, '-x', label='Fra logg')
    t=arange(50)
    plot(N0*(1-exp(-a*t)), label='Kurvetilpasning')
    N1 = N0 - Na[-1]
    xlabel('Uke')
    ylabel('Akkumulert fangst')
    legend()
    grid()
    print('Halveringstid = ' + str(-7*log(0.5)/a) + ' dager')
    print('N0 = ' + str(N0))
    Tu = (log(N0)-log(0.5))/a # tid fra t0 til utryddelse
    print('Utryddelsestid = ' + str(Tu) + ' uker')


fmin documentation:
https://reposhub.com/javascript/misc/benfred-fmin.html