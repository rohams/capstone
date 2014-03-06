xy=10;
breaks=[2 5];
offRout=4;


demand=randperm(xy);
stores=randperm(xy);

Truck=10;
for m=1:1:(length(breaks)+1)
        if m==1;
            T(m)=sum(demand(stores(1:(breaks(1)))));
        elseif  m  == (length(breaks)+1)
            
            T(m)=sum(demand(stores(((breaks(m-1))+1):(length(stores)))));
            Test1=stores(((breaks(m-1))+1):(length(stores)))
        else
         
            T(m)=sum(demand(stores(((breaks(m-1))+1):(breaks(m)))));
            test=stores(((breaks(m-1))+1):(breaks(m)))
        end
    
    
    
end


for v=1:(length(breaks)+1)
    if T(v) <= Truck
        X(v)=0;
    else
        X(v)=(T(v)-Truck)*offRout;
    end
   
end
 Cap_Penalty=sum(X)

  



